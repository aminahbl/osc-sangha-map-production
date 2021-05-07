import { graphql, useStaticQuery } from "gatsby"

export const GetPlaceData = () => {
  const { allProductionJson } = useStaticQuery(
    graphql`
      query placeDataQuery {
        allProductionJson {
          nodes {
            places {
              properties {
                description
                formatted_address
                geometry {
                  location {
                    lat
                    lng
                  }
                }
                international_phone_number
                name
                place_id
                website
                images
                monastics
                tradition
              }
              meta {
                verified
              }
            }
          }
        }
      }
    `
  )

  return allProductionJson.nodes
}
