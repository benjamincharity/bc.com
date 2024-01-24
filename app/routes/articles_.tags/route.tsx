import { LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { Badge } from '~/components/Badge'
import { PrimaryTitle } from '~/components/PrimaryTitle'
import { colors } from '~/data/colors.data'
import { RoutesPath } from '~/data/routes.data'
import { siteMetadata } from '~/data/siteMetadata'
import { BackToLink } from '~/routes/articles_.$id/components/BackToLink'
import { getAllArticles } from '~/utils/articles.server'
import { generateMetaCollection } from '~/utils/generateMetaCollection'
import { getTagsFromArticles } from '~/utils/getTagsFromArticles'

export type TagPayload = [string, number]
export type TagsPayload = Array<TagPayload>

interface LoaderData {
  tags: TagsPayload
}

export const loader: LoaderFunction = async () => {
  const articles = await getAllArticles()

  return json({
    tags: getTagsFromArticles(articles),
  })
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const { tags } = data as LoaderData
  const summaryTags = tags
    .slice(0, 3)
    .map(([tag]) => tag)
    .join(', ')
  return generateMetaCollection({
    summary: `Explore our comprehensive list of tags to easily find the topics that interest you. From ${summaryTags[0]}, ${summaryTags[1]}, to ${summaryTags[2]}, and more – dive into a world of insightful articles tailored to your interests.`,
    tags: tags.map(([tag]) => tag),
    title: 'Browse articles by tags.',
    url: `${siteMetadata.url}/articles/tags`,
  })
}

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&display=swap',
    },
  ]
}

export default function Tags() {
  const { tags } = useLoaderData<LoaderData>()

  return (
    <div className="prose-wrapper">
      <BackToLink to={RoutesPath.articles} />

      <PrimaryTitle title={'Tags'} className={'mb-6 text-center'} />

      <nav
        aria-label="Article tags"
        className="flex flex-wrap justify-center gap-8 text-base"
      >
        {tags.map(([tag, count], i) => {
          return (
            <Badge
              color={colors[i]}
              count={count}
              key={tag}
              linkTo={tag}
              tag={tag}
            />
          )
        })}
      </nav>
    </div>
  )
}
