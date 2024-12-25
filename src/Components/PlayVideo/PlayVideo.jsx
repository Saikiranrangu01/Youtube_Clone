import React, { useState, useEffect } from 'react'
import moment from 'moment'
import './PlayVideo.css'
import video1 from '../../assets/video.mp4'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import jack from '../../assets/jack.png'
import user_profile from '../../assets/user_profile.jpg'
import { API_KEY } from '../../data'
import {valueConverter} from '../../data'
import { useParams } from 'react-router-dom'



const PlayVideo = () => {

    const {videoId} = useParams();

    const [apiData, setApiData] = useState(null);
    const [channelData, setChannelData] = useState(null);
    const [commentData, setCommentData] = useState([]);

    const fetchVideoData = async ()=>{
        const videoResponse = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`);
        const videoData = await videoResponse.json();
        setApiData(videoData.items[0]);
    }

    const fetchOtherData = async ()=>{
        // fetching channel data
        const channelResponse = await fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`);
        const channelData = await channelResponse.json();
        setChannelData(channelData.items[0]);

        // fetching comment data
        const commentUrl = await fetch(`https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`);
        const responseCommentData = await commentUrl.json();
        setCommentData(responseCommentData.items)


    }

    useEffect(()=>{
        fetchVideoData();
    },[videoId])

    useEffect(()=>{
        fetchOtherData();
    },[apiData]);


  return (
    <div className="play-video">
        {/* <video src={video1} controls autoplay muted></video> */}
        <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen>
        </iframe>

        <h3>{apiData?apiData.snippet.title:"Title Here"}</h3>
        <div className="play-video-info">
            <p>{apiData?valueConverter(apiData.statistics.viewCount): "16k"} views &bull; {moment(apiData?apiData.snippet.publishedAt:"1month ago").fromNow()}</p>
            <div>
                <span><img src={like} alt="" />{apiData?valueConverter(apiData.statistics.likeCount):155}</span>
                <span><img src={dislike} alt=""  /> </span>
                <span><img src={share} alt="" /> Share</span>
                <span><img src={save} alt="" /> Save</span>
            </div>
        </div>
        <hr />
        <div className="publisher">
            <img src={channelData?channelData.snippet.thumbnails.default.url: jack} alt="" />
            <div>
                <p>{apiData?apiData.snippet.channelTitle: ""}</p>
                <span>{channelData?valueConverter(channelData.statistics.subscriberCount):"1K+"} Subscribers</span>
            </div>
            <button>Subscribe</button>
        </div>

        <div className="vi-description">
            <p>{apiData?apiData.snippet.description.slice(0,250):"Description Here"}</p>
            <hr />
            <h4>{apiData?valueConverter(apiData.statistics.commentCount):102} comments</h4>

            {commentData.map((item,index)=>{
                return(
                    <div key={index} className="comment">
                        <img src={item?item.snippet.topLevelComment.snippet.authorProfileImageUrl: ""} alt="" />
                        <div>
                            <h3>{item?item.snippet.topLevelComment.snippet.authorDisplayName:""} <span>1 day ago</span></h3>
                            <p>{item?item.snippet.topLevelComment.snippet.textDisplay:""}</p>
                            <div className="comment-action">
                                <img src={like} alt="" />
                                <span>{item?item.snippet.topLevelComment.snippet.likeCount:""}</span>
                                <img src={dislike} alt="" />
                            </div>
                        </div>
                    </div>
                )
            })}

        </div>
    </div>
  )
}

export default PlayVideo