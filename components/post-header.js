import DateFormatter from '../components/date-formatter'
import CoverImage from '../components/cover-image'
import PostTitle from '../components/post-title'

export default function PostHeader({ title, coverImage, date }) {
  return (
    <>
      <PostTitle>{title}</PostTitle>
    
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 text-xl font-mono">
          <DateFormatter dateString={date} />
        </div>
      </div>
    </>
  )
}
