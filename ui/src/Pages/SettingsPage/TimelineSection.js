import React, { useRef, useState } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { Input, Loader } from 'semantic-ui-react'
import {
  SectionTitle,
  InputLabelTitle,
  InputLabelDescription,
} from './SettingsPage'

const IMAGES_PER_DATE_QUERY = gql`
  query imagesPerDateQuery {
    siteInfo {
      imagesPerDate
    }
  }
`

const SET_IMAGES_PER_DATE_MUTATION = gql`
  mutation setImagesPerDate($imagesPerDate: Int!) {
    setImagesPerDate(imagesPerDate: $imagesPerDate)
  }
`

const TimelineSection = () => {
  const imagesAmountQuery = useQuery(IMAGES_PER_DATE_QUERY, {
    onCompleted(data) {
      setImagesAmount(data.siteInfo.imagesPerDate)
      imagesAmountServerValue.current = data.siteInfo.imagesPerDate
    },
  })

  const [setImagesPerDateMutation, imagesPerDateMutationData] = useMutation(
    SET_IMAGES_PER_DATE_MUTATION
  )

  const imagesAmountServerValue = useRef(null)
  const [imagesAmount, setImagesAmount] = useState('')

  const updateImagesAmount = imagesAmount => {
    if (imagesAmountServerValue.current != imagesAmount) {
      imagesAmountServerValue.current = imagesAmount
      setImagesPerDateMutation({
        variables: {
          imagesPerDate: imagesAmount,
        },
      })
    }
  }

  return (
    <div>
      <SectionTitle nospace>Photos Timeline</SectionTitle>
      <InputLabelDescription></InputLabelDescription>

      <div style={{ marginTop: 32 }}>
        <label htmlFor="timeline_images_per_date_field">
          <InputLabelTitle>Images Per Date</InputLabelTitle>
          <InputLabelDescription>
            The maximum number of images per date to show on the main photos
            timeline
          </InputLabelDescription>
        </label>
        <Input
          disabled={
            imagesAmountQuery.loading || imagesPerDateMutationData.loading
          }
          type="number"
          min="1"
          id="timeline_images_per_date_field"
          value={imagesAmount}
          onChange={(_, { value }) => {
            setImagesAmount(value)
          }}
          onBlur={() => updateImagesAmount(imagesAmount)}
          onKeyDown={({ key }) =>
            key == 'Enter' && updateImagesAmount(imagesAmount)
          }
        />
        <Loader
          active={
            imagesAmountQuery.loading || imagesPerDateMutationData.loading
          }
          inline
          size="small"
          style={{ marginLeft: 16 }}
        />
      </div>
    </div>
  )
}

export default TimelineSection
