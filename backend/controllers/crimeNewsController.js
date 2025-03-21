import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { getJson } from "serpapi";
import dotenv, { config } from "dotenv"
dotenv.config({path: '../config/config.env'})

export const getCrimeNews = catchAsyncErrors(async (req, res, next) => {
    try {
        const crimeTopic = req.query.crimeTopic || "cyber crime";  // Default to cyber crime if no topic is provided
        const location = req.query.location || "";  // Optional location filter
        console.log(crimeTopic, location);

        const response = await getJson({
            engine: "google_news",
            q: crimeTopic + (location ? " " + location : ""),  // Only add location if provided
            hl: "en",
            api_key: process.env.API_KEY
        });

        if (response.news_results) {
            const news = response.news_results.map(result => ({
                title: result.title,
                source: result.source,
                link: result.link,
                date: result.date
            }));
            console.log(news);
            return res.status(200).json({
                success: true,
                message: "Crime News Fetched Successfully",
                news: news, 
                newsResult: response.news_results
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "No news found"
            });
        }
    } catch (error) {
        console.error('Error fetching crime news:', error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
})