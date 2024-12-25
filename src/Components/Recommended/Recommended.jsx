import React, { useState, useEffect } from 'react'
import './Recommended.css'
import {Link} from 'react-router-dom'
import { API_KEY, valueConverter } from '../../data'

const Recommended = ({categoryId}) => {
    const [apiData, setApiData] = useState([]);

    const fetchData = async ()=>{
        const relatedVideoUrl = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=45&regionCode=US&videoCategoryId=${categoryId}&key=${API_KEY}`);
        const relatedVideoData = await relatedVideoUrl.json();
        setApiData(relatedVideoData.items);
    }

    useEffect(()=>{
        fetchData();
    },[])

  return (
    <div className="recommended">
        {apiData.map((item,index)=>{
            return(
                <Link to={`/video/${item.snippet.categoryId}/${item.id}`} key={index} className="side-video-list">
                    <img src={item.snippet.thumbnails.medium.url} alt="" />
                    <div className="vid-info">
                        <h4>{item.snippet.title}</h4>
                        <p>{item.snippet.channelTitle}</p>
                        <p>{valueConverter(item.statistics.viewCount)} Views</p>
                    </div>  
                </Link>
            )
        })}

    
    </div>
  )
}

export default Recommended