import { graphql, useStaticQuery } from "gatsby"

export const GetPlaceData = () => {
  const { allProductionJson } = useStaticQuery(
    graphql`
      query placeDataQuery {
        allProductionJson {
          nodes {
            places {
              name
              location {
                lat
                lng
              }
              address
              phone
              website
              tradition
              monastics
              description
              images
              video
              audio
              google_maps_url
              category
              last_updated
            }
          }
        }
      }
    `
  )

  return allProductionJson.nodes
}
