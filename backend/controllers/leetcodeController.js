import axios from 'axios';
import User from '../models/User.js';
import { decrypt } from '../utils/crypto.js';

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';

/**
 * Proxy requests to LeetCode GraphQL API
 * This allows us to keep the session cookie secure
 */
export const proxyLeetCodeRequest = async (req, res) => {
  const userId = req.user.id;
  const { query, variables } = req.body;

  if (!query) {
    return res.status(400).json({ message: 'GraphQL query is required' });
  }

  try {
    // Get user's LeetCode session key
    const user = await User.findById(userId).select('+leetcodeSessionKey').lean();
    
    if (!user || !user.leetcodeSessionKey) {
      return res.status(403).json({ 
        message: 'LeetCode session key not found. Please add your API key.'
      });
    }

    // Decrypt the session key
    const sessionKey = decrypt(user.leetcodeSessionKey);
    
    // Forward the request to LeetCode
    const response = await axios.post(LEETCODE_GRAPHQL_URL, 
      { query, variables },
      { 
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `LEETCODE_SESSION=${sessionKey}`,
          'User-Agent': 'Mozilla/5.0',
          'Referer': 'https://leetcode.com'
        } 
      }
    );

    // Return the data from LeetCode
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying request to LeetCode:', error);
    res.status(500).json({ 
      message: 'Failed to proxy request to LeetCode',
      error: error.message
    });
  }
};
