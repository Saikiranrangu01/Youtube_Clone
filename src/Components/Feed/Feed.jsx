import React, {useState, useEffect} from 'react'
import moment from 'moment'
import './Feed.css'
import { Link } from 'react-router-dom'
import { API_KEY, valueConverter } from '../../data'

const Feed = ({category}) => {
  const [data, setData] = useState([]);

  const fetchedData = async ()=> {
    const response = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${category}&key=${API_KEY}`);
    const data = await response.json();
    setData(data.items);
  }

  useEffect(()=>{
    fetchedData();
  },[category]);



  return (
    <div className="feed">
      {data.map((item, index)=>{
        return(
      <Link to = {`video/${item.snippet.categoryId}/${item.id}`} className='card' key={item.id}>
          <div>
            <img src={item.snippet.thumbnails.medium.url} alt="" />
            <h2>{item.snippet.title}</h2>
            <h3>{item.snippet.channelTitle}</h3>
            <p>{valueConverter(item.statistics.viewCount)} views &bull; {moment(item.snippet.publishedAt).fromNow()}</p>
          </div>
      </Link>

        )

      })}
      
    </div>
  )
}

export default Feed