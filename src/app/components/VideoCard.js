import React from 'react'
import { Button, Progress, Card, CardBody, CardImg, CardTitle, CardSubtitle, CardText } from 'reactstrap'
import { DownloadVideo } from './LibraryService'

const renderTime = (sec) => new Date(sec * 1000).toISOString().substr(11, 8).replace(/(0+:?)*/, '')

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
      <CardImg top src={video.thumbnail.url} />
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
            <React.Fragment>
              <CardText className='text-danger'>Error streaming video</CardText>
              <Button color='secondary' block onClick={() => onDelete(video.vid)}>Delete</Button>
            </React.Fragment>
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
