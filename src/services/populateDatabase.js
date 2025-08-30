require('dotenv').config()

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const _ = require('lodash')

const Verse = require('../models/verse')
const Surah = require('../models/surah')
const Juz = require('../models/juz');


const TOKEN_FILE = path.join(__dirname, 'token.json');

// Load token from file
function loadToken() {
  try {
    if (fs.existsSync(TOKEN_FILE)) {
      return JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
    }
  } catch (error) {
    console.log('No existing token file found');
  }
  return null;
}

// Save token to file
function saveToken(token, expiration) {
  const tokenData = {
    token: token,
    expiration: expiration
  };
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenData, null, 2));
}

async function getAccessToken() {

  const now = new Date();
  const tokenData = loadToken();

  console.log("Checking token...");
  
  // Check if we need a new token
  const needNewToken = !tokenData || 
                      !tokenData.token || 
                      now.getTime() > tokenData.expiration;

  if (needNewToken) {
    console.log("Getting new token...");

    const auth = Buffer.from(`${process.env.ClientId}:${process.env.ClientSecret}`).toString('base64');
    
    try {
      const response = await axios({
        method: 'post',
        url: `${process.env.AuthBaseUrl}/oauth2/token`,
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: 'grant_type=client_credentials&scope=content'
      });

      // Save token and set expiration to 1 hour from now
      const expiration = now.getTime() + 60 * 60 * 1000;
      saveToken(response.data.access_token, expiration);

      console.log('New token received and saved');
      return response.data.access_token;
  
    } catch (error) {
      console.error('Error getting access token:', error.response?.data || error.message);
      throw error;
    }
  } else {
    console.log("Using existing token from file");
    return tokenData.token;
  }
}

async function apiCall(endpoint, params = {}){

  const accessToken = await getAccessToken();
  const clientId = process.env.ClientId;

  try {
    const response = await axios({
      method: 'get',
      url: `${process.env.ApiBaseUrl}/content/api/v4/${endpoint}`,
      headers: {
        'x-auth-token': accessToken,
        'x-client-id': clientId
      },
      params

    });
    
    console.log('response received successfully');
    return response;
  } catch (error) {
    console.error('Error fetching response:', error.response?.data || error.message);
    throw error;
  }

}

async function populateDatabase(VersesData = {}, SurahsData = {}, JuzsData = {}){

  try {

    const allVerses = new Verse(VersesData)

    const allSurahs = new Surah(SurahsData)

    const allJuzs = new Juz(JuzsData)

    await allVerses.save()
    await allSurahs.save()
    await allJuzs.save()

  }catch(error) {

    console.log(error.message);

  }

}

function prepareVersesData(versesDetails = {}){

  const keysToSelect = ['text_uthmani_tajweed','verse_number','id','chapter_id','page_number','juz_number']

  const VersesData = []

  // Iterate through the values (actual verse objects)
  Object.values(versesDetails).forEach(verse => {
    
    const filteredVerse = Object.keys(verse).reduce((newDict, key) => {
      
      if(keysToSelect.includes(key)){
        newDict[key] = verse[key]
      }
      
      return newDict
      
    }, {})
    
    VersesData.push(filteredVerse)
  })

  console.log('Prepared verses data length:', VersesData.length);
  console.log('Sample prepared verse:', VersesData[0]);


  return VersesData

}

function prepareSurahData(verses,surahsDetails = {}){

  const versesBySurah = verses.reduce( (groups, verse) => {

    const chapterId = verse.chapter_id

    if( !groups[chapterId] ){
      groups[chapterId] = []
    }

    groups[chapterId].push(verse)

    return groups

  }, {} )

  const surahs = Object.entries(versesByChapter).map(([chapterId, verses]) => {
    const verseIds = verses.map(v => v.id);
    const chapterIdNum = parseInt(chapterId);
    
    return {
      chapter_id: chapterIdNum,
      first_verse_id: Math.min(...verseIds),
      last_verse_id: Math.max(...verseIds),
      chapter_name: surahsDetails[chapterId]?.name || surahsDetails[chapterIdNum]?.name || 'Unknown'
    };
  });

  return surahs;


}

function prepareData(versesDetails = {}, surahsDetails = {} ){

  const verses = prepareVersesData(versesDetails)

  const surhas = prepareSurahData(verses, surahsDetails)


  
}


async function getSurahsDetails() {

  const endpoint = 'chapters'
  const params = {}

  const response = await apiCall(endpoint, params)

  console.log(response.data);

}

async function getVersesByJuz(juzNumber){

  const endpoint = `verses/by_juz/${juzNumber}`
  currentPage = 1 // initally
  totalPages = 1  // initally

  allVersesContent = []

  while (currentPage <= totalPages){
    
    const params = { fields :"text_uthmani_tajweed,verse_index,chapter_id", per_page : 50, page : currentPage } 

    const response = await apiCall(endpoint, params)

    const verses = response.data.verses

    allVersesContent.push(verses)

    totalPages = response.data.pagination.total_pages

    currentPage++

  }

  return allVersesContent.flat()[0]
}

async function getAllVersesByJuzs(){

  allJuzs = []

  for (let i = 1; i <= 2; i++) {
   
    console.log("Getting Juz : ", i);
    juz = await getVersesByJuz(i)
    allJuzs.push(juz)

  }

  return allJuzs

}

// Main execution function
async function main() {
  try {

    verses = await getAllVersesByJuzs()
    prepareData( verses,{} )

  } catch (error) {
    console.error('Main execution error:', error.message);
  }
}

// Run the main function
main();