import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import Contest from '../models/Contest.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const BATCH_SIZE = 10;
const DELAY_BETWEEN_BATCHES = 3000;

async function fetchYoutubeVideoLink(query) {
  const channelId = 'UC2zQZ2xWvqrwEuduf6_7gKA'; // Vivek Gupta's channel
  const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&part=snippet&type=video&maxResults=2&channelId=${channelId}&q=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(url);
    const items = response.data.items;

    const requiredWords = query.toLowerCase().split(/\s+/);

    for (const item of items) {
      const title = item.snippet.title.toLowerCase();

      const allMatch = requiredWords.every(word => title.includes(word));
      if (allMatch) {
        const videoId = item.id.videoId;
        return `https://www.youtube.com/watch?v=${videoId}`;
      }
    }

    return null;
  } catch (error) {
    console.error(`❌ Failed to fetch YouTube link for "${query}":`, error.message);
    return null;
  }
}

async function updateContestLinksFromYouTube() {
  try {
    console.log('🚀 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });
    console.log('✅ Connected to MongoDB');

    const totalCount = await Contest.countDocuments();
    console.log(`📄 Total contests in DB: ${totalCount}`);

    let processed = 0;
    let updated = 0;

    while (processed < totalCount) {
      const batch = await Contest.find().skip(processed).limit(BATCH_SIZE);

      const updates = [];

      for (const contest of batch) {
        const query = `${contest.title} leetcode contest`;
        const youtubeLink = await fetchYoutubeVideoLink(query);

        if (youtubeLink) {
          updates.push({
            updateOne: {
              filter: { _id: contest._id },
              update: { $set: { link: youtubeLink } },
            },
          });
        }
      }

      if (updates.length > 0) {
        const result = await Contest.bulkWrite(updates);
        updated += result.modifiedCount;
        console.log(`✅ Updated ${result.modifiedCount} contests`);
      }

      processed += batch.length;
      console.log(`⏳ Progress: ${processed}/${totalCount}`);

      if (processed < totalCount) {
        console.log(`⏱️ Waiting ${DELAY_BETWEEN_BATCHES / 1000}s...`);
        await new Promise((res) => setTimeout(res, DELAY_BETWEEN_BATCHES));
      }
    }

    console.log(`🎉 Done! Total contests updated: ${updated}`);
  } catch (err) {
    console.error('❌ Error during update:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

updateContestLinksFromYouTube();
