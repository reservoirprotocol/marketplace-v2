import { useState, useEffect, FC, SyntheticEvent, useContext } from 'react'
import { useTheme } from 'next-themes'
import { useDropzone, FileError } from 'react-dropzone';
import { Text, Flex, Box, Input, Button, TextArea, Select } from 'components/primitives'
import { StyledInput } from "components/primitives/Input";
import { ToastContext } from '../../../context/ToastContextProvider'

type Props = {
  activeTab: string | null
}

const DetailsSettings:FC<Props> = ({ activeTab }) => {
  const { theme } = useTheme();
  const { addToast } = useContext(ToastContext)

  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [collectionImages, setCollectionImages] = useState<File[]>([])
  const [coverImages, setCoverImages] = useState<File[]>([])
  const [category, setCategory] = useState<string | undefined>()
  const [websiteLink, setWebsiteLink] = useState('')
  const [twitter, setTwitter] = useState('')
  const [discord, setDiscord] = useState('')

  const categoryOptions = [
    { label: 'Art', value: 'art' },
    { label: 'Domain Names', value: 'domain_names' },
    { label: 'Gaming', value: 'gaming' },
    { label: 'Memberships', value: 'memberships' },
    { label: 'Music', value: 'music' },
    { label: 'PFPs', value: 'pfps' },
    { label: 'Photography', value: 'photography' },
    { label: 'Sports collectibles', value: 'sports_collectibles' },
    { label: 'Virtual worlds', value: 'virtual_worlds' },
    { label: 'No Category', value: 'no_category' },
  ]

  const { 
    getRootProps: getCollectionImageRootProps, 
    getInputProps: getCollectionImageInputProps } = useDropzone({
      maxSize: 5000000,
      accept: {
        'image/*': []
      },
      onDrop: (acceptedFiles, rejectedFiles) => {
        if (rejectedFiles.length > 0) {
          handleErrorDropImage(rejectedFiles)
        }

        setCollectionImages(acceptedFiles.map(file => Object.assign(file, {
          preview: URL.createObjectURL(file)
        })));
      }
    }
  );

  const { 
    getRootProps: getCoverImageRootProps, 
    getInputProps: getCoverImageInputProps } = useDropzone({
      maxSize: 1000000,
      accept: {
        'image/*': []
      },
      onDrop: (acceptedFiles, rejectedFiles) => {
        if (rejectedFiles.length > 0) {
          handleErrorDropImage(rejectedFiles)
        }
        
        setCoverImages(acceptedFiles.map(file => Object.assign(file, {
          preview: URL.createObjectURL(file)
        })));
      },
      onError: err => console.log(err)
    }
  );

  const handleErrorDropImage = (rejectedFiles: any) => {
    rejectedFiles.forEach((file: any) => {
      file.errors.forEach((err: any) => {
        addToast?.({
          title: err.code,
          description: err.message
        })
      });
    });
  }

  const resetState = () => {
    setName('');
    setUrl('');
    setDescription('');
    setCollectionImages([]);
    setCoverImages([]);
    setCategory(undefined);
    setWebsiteLink('');
    setTwitter('');
    setDiscord('');
  }

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // TODO: Fetch to API
  }

  useEffect(() => {
    if (activeTab !== 'details') resetState();
  }, [activeTab])

  const renderThumbs = (images: any, state: string) => images.map((file: any) => (
    <Box 
      key={file.name}
      css={{
        height: '100%',
        boxSizing: 'border-box',
        position: 'relative'
      }}>
      <Flex 
        css={{
          overflow: 'hidden',
          height: '100%',
        }}>
        <img
          src={file.preview}
          style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
          onLoad={() => { URL.revokeObjectURL(file.preview) }}/>
      </Flex>
    </Box>
  ));
  
  return (
    <Box
      css={{
        width: '100%',
        '@md': {
          marginLeft: 4,
          width: '60%'
        },
        '@lg': {
          marginLeft: 4,
          width: '50%'
        }
      }}>
      <Box 
        css={{ 
          marginBottom: 18
        }}>
        <Text style='h4'>
          Details Settings
        </Text>
      </Box>
      <Box css={{ marginBottom: 32 }}>
        <Text style="h6" css={{ color: '$gray11' }}>Name</Text>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Enter a name for the collection'
          css={{ backgroundColor: theme === 'light' ? '$gray1' : 'initial' }}
          containerCss={{
            marginTop: 6,
            width: '100%',
            border: '1px solid $gray8',
            borderRadius: 6,
          }}
        />
      </Box>
      <Box css={{ marginBottom: 32 }}>
        <Text style="h6" css={{ color: '$gray11' }}>URL</Text>
        <Box css={{ position: 'relative', width: '100%' }}>
          <Text 
            css={{ 
              position: 'absolute',
              top: 18,
              left: 16,
              opacity: .8
            }}>
            https://nftearth.exchange/launch/
          </Text>
          <StyledInput
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder='treasures-of-the-sea'
            css={{
              backgroundColor: theme === 'light' ? '$gray1' : 'initial',
              marginTop: 6,
              width: '100%',
              border: '1px solid $gray8',
              borderRadius: 6,
              pl: 270,
              boxSizing: 'border-box'
            }}
          />
        </Box>
      </Box>
      <Box css={{ marginBottom: 32 }}>
        <Text style="h6" css={{ color: '$gray11' }}>Description</Text>
        <TextArea
          value={description}
          rows={5}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Describe your collection'
          css={{ backgroundColor: theme === 'light' ? '$gray1' : 'initial' }}
          containerCss={{
            marginTop: 6,
            width: '100%',
            border: '1px solid $gray8',
            borderRadius: 6,
          }}
        />
      </Box>
      <Box css={{ marginBottom: 40 }}>
        <Flex direction='column'>
          <Text style="h6" css={{ color: '$gray11' }}>Collection Image</Text>
          <Text style='subtitle3' css={{ color: '$gray11', marginBottom: 6 }}>
            Uploading an image will overide the contract-level metadata (ContractURI) image, if set.
          </Text>
        </Flex>
        <Box css={{ position: 'relative', width: 160 }}>
          {collectionImages.length === 0 ? (
            <Box {...getCollectionImageRootProps()}>
              <Input
                {...getCollectionImageInputProps()}
                css={{ backgroundColor: theme === 'light' ? '$gray1' : 'initial' }}
                containerCss={{
                  marginTop: 6,
                  width: '100%',
                  border: '1px solid $gray8',
                  borderRadius: 6,
                  borderStyle: 'dashed',
                  height: 160,
                  cursor: 'pointer'
                }}
              />
              <Flex 
                align='center'
                css={{ 
                  color: '$gray10',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translateX(-50%) translateY(-50%)',
                  height: '100%'
                }}>
                {collectionImages.length === 0 && (
                  <Text css={{ cursor: 'pointer', fontSize: 10, textAlign: 'center', color: '$gray11' }}>
                    Drag 'n' drop some files here, or click to select
                  </Text>
                )}
              </Flex>
            </Box>
          ) : (
            <Box
              css={{
                width: 160,
                height: 160,
                border: 'solid 1px $gray10',
                borderStyle: 'dashed',
                marginTop: 6,
                borderRadius: 6
              }}>
              {renderThumbs(collectionImages, 'collectionImages')}
              {collectionImages.length > 0 && (
                <Button 
                  color='ghost' 
                  css={{ padding: 0, fontSize: 14 }}
                  onClick={() => setCollectionImages([])}>
                  Reset
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Box>
      <Box css={{ marginBottom: 40 }}>
        <Flex direction='column'>
          <Text style="h6" css={{ color: '$gray11' }}>Cover Image</Text>
        </Flex>
        <Box css={{ position: 'relative', width: '100%' }}>
          {coverImages.length === 0 ? (
            <Box {...getCoverImageRootProps()}>
              <Input
                {...getCoverImageInputProps()}
                css={{ backgroundColor: theme === 'light' ? '$gray1' : 'initial' }}
                containerCss={{
                  marginTop: 6,
                  width: '100%',
                  border: '1px solid $gray8',
                  borderRadius: 6,
                  borderStyle: 'dashed',
                  height: 160,
                  cursor: 'pointer'
                }}
              />
              <Flex 
                align='center'
                css={{ 
                  color: '$gray10',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translateX(-50%) translateY(-50%)',
                  height: '100%',
                }}>
                {coverImages.length === 0 && (
                  <Text css={{ cursor: 'pointer', fontSize: 10, textAlign: 'center', color: '$gray11' }}>
                    Drag 'n' drop some files here, or click to select
                  </Text>
                )}
              </Flex>
            </Box>
          ) : (
            <Box
              css={{
                width: 320,
                height: 160,
                border: 'solid 1px $gray10',
                borderStyle: 'dashed',
                marginTop: 6,
                borderRadius: 6
              }}>
              {renderThumbs(coverImages, 'coverImages')}
              {coverImages.length > 0 && (
                <Button 
                  color='ghost' 
                  css={{ padding: 0, fontSize: 14 }}
                  onClick={() => setCoverImages([])}>
                  Reset
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Box>
      <Box css={{ marginBottom: 32 }}>
        <Text style="h6" css={{ color: '$gray11' }}>Category</Text>
        <Select 
          options={categoryOptions} 
          value={category}
          placeholder="Select a category"
          onChange={(val: string) => setCategory(val)} 
          containerCss={{ marginTop: 6 }}/>
      </Box>
      <Box css={{ marginBottom: 32 }}>
        <Text style="h6" css={{ color: '$gray11' }}>Website Link</Text>
        <Box css={{ position: 'relative', width: '100%' }}>
          <Text 
            css={{ 
              position: 'absolute',
              top: 18,
              left: 16,
              opacity: .8
            }}>
            https://
          </Text>
          <StyledInput
            value={websiteLink}
            onChange={(e) => setWebsiteLink(e.target.value)}
            placeholder='nftearth.exchange.com'
            css={{
              backgroundColor: theme === 'light' ? '$gray1' : 'initial',
              marginTop: 6,
              width: '100%',
              border: '1px solid $gray8',
              borderRadius: 6,
              pl: 72,
              boxSizing: 'border-box'
            }}
          />
        </Box>
      </Box>
      <Box css={{ marginBottom: 32 }}>
        <Text style="h6" css={{ color: '$gray11' }}>Twitter</Text>
        <Box css={{ position: 'relative', width: '100%' }}>
          <Text 
            css={{ 
              position: 'absolute',
              top: 18,
              left: 16,
              opacity: .8
            }}>
            https://twitter.com/
          </Text>
          <StyledInput
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
            placeholder='@NFTEarth'
            css={{
              backgroundColor: theme === 'light' ? '$gray1' : 'initial',
              marginTop: 6,
              width: '100%',
              border: '1px solid $gray8',
              borderRadius: 6,
              pl: 160,
              boxSizing: 'border-box'
            }}
          />
        </Box>
      </Box>
      <Box css={{ marginBottom: 32 }}>
        <Text style="h6" css={{ color: '$gray11' }}>Discord</Text>
        <Box css={{ position: 'relative', width: '100%' }}>
          <Text 
            css={{ 
              position: 'absolute',
              top: 18,
              left: 16,
              opacity: .8
            }}>
            https://discord.gg/
          </Text>
          <StyledInput
            value={discord}
            onChange={(e) => setDiscord(e.target.value)}
            placeholder='NFTEarth'
            css={{
              backgroundColor: theme === 'light' ? '$gray1' : 'initial',
              marginTop: 6,
              width: '100%',
              border: '1px solid $gray8',
              borderRadius: 6,
              pl: 155,
              boxSizing: 'border-box'
            }}
          />
        </Box>
      </Box>
      <Button 
        onClick={handleSubmit}
        css={{ 
          marginBottom: 12,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          justifyItems: 'center',
        }}>
        Save
      </Button>
    </Box>
  )
}

export default DetailsSettings