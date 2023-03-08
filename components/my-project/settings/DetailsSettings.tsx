import { useState, useEffect, FC, SyntheticEvent, useContext } from 'react'
import { useTheme } from 'next-themes'
import { useDropzone, FileError } from 'react-dropzone';
import { Text, Flex, Box, Input, Button, TextArea, Select } from 'components/primitives'
import { StyledInput } from "components/primitives/Input";
import { ToastContext } from 'context/ToastContextProvider'
import {useDebounce, useLaunchpads, useMarketplaceChain} from "hooks";

type Props = {
  launchpad: ReturnType<typeof useLaunchpads>["data"][0]
}

const Thumbs = ({ image } : { image: string }) => (
  <Box
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
        src={image}
        style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
        onLoad={() => { URL.revokeObjectURL(image) }}/>
    </Flex>
  </Box>
);

const fileUpload = async (file: File, newFileName: string) => {
  const res = await fetch(`/api/image/upload?file=${encodeURIComponent(newFileName)}`);
  const {url, fields} = await res.json();
  const formData = new FormData();

  const blob = file.slice(0, file.size, file.type);

  Object.entries({...fields, file: new File([blob], newFileName, {type: file.type})}).forEach(([key, value]) => {
    formData.append(key, value as string | Blob);
  });

  return await fetch(url, {
    method: 'POST',
    body: formData,
    mode: 'no-cors'
  });
}

const DetailsSettings:FC<Props> = ({ launchpad }) => {
  const { theme } = useTheme();
  const { addToast } = useContext(ToastContext)
  const marketplaceChain = useMarketplaceChain()
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [collectionImage, setCollectionImage] = useState<string | undefined>(undefined)
  const [coverImage, setCoverImage] = useState<string | undefined>(undefined)
  const [category, setCategory] = useState<string | undefined>()
  const [websiteLink, setWebsiteLink] = useState('')
  const [twitter, setTwitter] = useState('')
  const [discord, setDiscord] = useState('')

  const debouncedSlug = useDebounce(slug, 3000);
  const {data: existingLaunchpad} = useLaunchpads(
    marketplaceChain,
    {
      slug: debouncedSlug,
      limit: 1
    },
    {
        keepPreviousData: false,
      revalidateAll: false
    }
  )

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

  useEffect(() => {
    if (launchpad) {
      setName(launchpad.name as string)
      setSlug((launchpad.slug as string || ''))
      setDescription(launchpad.description || '')
      setCollectionImage(launchpad.image || '')
      setCoverImage(launchpad.banner || '')
      setWebsiteLink(launchpad.externalUrl || '')
      setTwitter(launchpad.twitterUsername || '')
      setDiscord(launchpad.discordUrl || '')
    }
  }, [launchpad])

  const { 
    getRootProps: getCollectionImageRootProps, 
    getInputProps: getCollectionImageInputProps } = useDropzone({
      maxSize: 5000000,
      accept: {
        'image/*': []
      },
      onDrop: async (acceptedFiles, rejectedFiles) => {
        if (rejectedFiles.length > 0) {
          handleErrorDropImage(rejectedFiles)
        }

        if (acceptedFiles.length > 0) {
          const newFileName = `collection-image-${launchpad.id}.${acceptedFiles[0].name.split('.').pop()}`;

          await fileUpload(acceptedFiles[0], newFileName);

          setCollectionImage(`https://nftearth-images.storage.googleapis.com/${newFileName}`);
        }
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
      onDrop: async (acceptedFiles, rejectedFiles) => {
        if (rejectedFiles.length > 0) {
          handleErrorDropImage(rejectedFiles)
        }

        if (acceptedFiles.length > 0) {
          const newFileName = `collection-cover-${launchpad.id}.${acceptedFiles[0].name.split('.').pop()}`;
          await fileUpload(acceptedFiles[0], newFileName);

          setCoverImage(`https://nftearth-images.storage.googleapis.com/${newFileName}`);
        }
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

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('Submit')

    try {
      await fetch(`${marketplaceChain.proxyApi}/launchpad/update/v1`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: launchpad.id,
          name,
          slug,
          allowlists: launchpad.allowlists || [],
          verified: true,
          metadata: {
            imageUrl: collectionImage || null,
            bannerImageUrl: coverImage || null,
            discordUrl: discord,
            description: description,
            externalUrl: websiteLink,
            twitterUsername: twitter,
          },
          royalties: launchpad.royalties?.breakdown || []
        })
      })
    } catch (err: any) {
      addToast?.({
        title: 'ERROR',
        description: err.message
      })
    }

    setLoading(false)
  }
  
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
      <form onSubmit={handleSubmit} >
        <Box
          css={{
            marginBottom: 18
          }}>
          <Text style='h4'>
            Collection Settings
          </Text>
        </Box>
        <Box css={{ marginBottom: 32 }}>
          <Text style="h6" css={{ color: '$gray11' }}>Name</Text>
          <Input
            value={name}
            disabled={loading}
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
              disabled={loading}
              value={slug}
              pattern="^[a-z0-9](-?[a-z0-9])*$"
              onChange={(e) => setSlug(e.target.value)}
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
          {(existingLaunchpad && existingLaunchpad.length > 0 && existingLaunchpad[0].id?.toLowerCase() !== launchpad.id?.toLowerCase()) && (
            <Text css={{ color: 'red' }}>Slug unavailable</Text>
          )}
        </Box>
        <Box css={{ marginBottom: 32 }}>
          <Text style="h6" css={{ color: '$gray11' }}>Description</Text>
          <TextArea
            disabled={loading}
            rows={5}
            value={description}
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
            {!collectionImage ? (
              <Box {...getCollectionImageRootProps()}>
                <Input
                  disabled={loading}
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
                  <Text css={{ cursor: 'pointer', fontSize: 10, textAlign: 'center', color: '$gray11' }}>
                    Drag 'n' drop some files here, or click to select
                  </Text>
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
                <Thumbs image={collectionImage} />
                <Button
                  disabled={loading}
                  color='ghost'
                  css={{ padding: 0, fontSize: 14 }}
                  onClick={() => setCollectionImage(undefined)}>
                  Reset
                </Button>
              </Box>
            )}
          </Box>
        </Box>
        <Box css={{ marginBottom: 40 }}>
          <Flex direction='column'>
            <Text style="h6" css={{ color: '$gray11' }}>Cover Image</Text>
          </Flex>
          <Box css={{ position: 'relative', width: '100%' }}>
            {!coverImage ? (
              <Box {...getCoverImageRootProps()}>
                <Input
                  {...getCoverImageInputProps()}
                  disabled={loading}
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
                  <Text css={{ cursor: 'pointer', fontSize: 10, textAlign: 'center', color: '$gray11' }}>
                    Drag 'n' drop some files here, or click to select
                  </Text>
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
                <Thumbs image={coverImage} />
                <Button
                  disabled={loading}
                  color='ghost'
                  css={{ padding: 0, fontSize: 14 }}
                  onClick={() => setCoverImage(undefined)}>
                  Reset
                </Button>
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
            <StyledInput
              value={websiteLink}
              disabled={loading}
              onChange={(e) => setWebsiteLink(e.target.value)}
              placeholder='https://nftearth.exchange.com'
              css={{
                backgroundColor: theme === 'light' ? '$gray1' : 'initial',
                marginTop: 6,
                width: '100%',
                border: '1px solid $gray8',
                borderRadius: 6,
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
              disabled={loading}
              onChange={(e) => setTwitter(e.target.value)}
              placeholder='NFTEarth'
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
              disabled={loading}
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
          type="submit"
          disabled={loading}
          css={{
            marginBottom: 12,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            justifyItems: 'center',
          }}>
          Save
        </Button>
      </form>
    </Box>
  )
}

export default DetailsSettings