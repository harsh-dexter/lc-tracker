import axios from 'axios';

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';

/**
 * Check if a problem is solved using LeetCode GraphQL API
 * @param {string} titleSlug - Problem's titleSlug
 * @returns {Promise<boolean>} Whether the problem is solved
 */
export async function checkProblemSolved(titleSlug) {
  try {
    const response = await axios.post('/api/leetcode-proxy', {
      query: `
        query isProblemSolved($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            status
          }
        }
      `,
      variables: { titleSlug }
    });

    // LeetCode returns 'ac' when a problem is accepted/solved
    return response.data?.data?.question?.status === 'ac';
  } catch (error) {
    console.error(`Error checking problem status for ${titleSlug}:`, error);
    throw error;
  }
}
