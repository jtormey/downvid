import React from 'react'
import { Button, Progress, Card, CardBody, CardImg, CardTitle, CardSubtitle } from 'reactstrap'
import { DownloadVideo } from './LibraryService'

const renderTime = (sec) => `${Math.floor(sec / 60)}:${sec % 60}`

const vidTimeTag = {
  position: 'absolute',
  right: 0,
  bottom: 0,
  margin: 4,
  padding: '0px 4px',
  opacity: 0.8,
  color: 'hsl(0, 0%, 100%)',
  background: 'hsl(0, 0%, 6.7%)'
}

const VideoCard = ({ video, onPlay, onDelete }) => (
  <Card>
    <div style={{ position: 'relative' }}>
      <CardImg top src={video.thumbnail.url} width={video.thumbnail.width} height={video.thumbnail.height} />
      <div style={vidTimeTag}>
        <span>{renderTime(video.length)}</span>
      </div>
    </div>
    <CardBody>
      <CardTitle>{video.title}</CardTitle>
      <CardSubtitle>{video.author.name}</CardSubtitle>
      <div style={{ marginTop: 16 }}>
        <DownloadVideo
          vid={video.vid}
          renderProgress={({ progress }) => (
            <Progress value={Math.round(progress * 100)} />
          )}
          renderError={() => (
            <CardSubtitle>Error streaming video</CardSubtitle>
          )}
          renderComplete={() => (
            <React.Fragment>
              <Button color='primary' block onClick={() => onPlay(video.vid)}>Play</Button>
              <Button color='secondary' block onClick={() => onDelete(video.vid)}>Delete</Button>
            </React.Fragment>
          )}
        />
      </div>
    </CardBody>
  </Card>
)

export default VideoCard
