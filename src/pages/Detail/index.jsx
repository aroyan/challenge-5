import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Badge,
  Heading,
  HStack,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  AspectRatio,
  ModalHeader,
  Flex,
  Skeleton,
} from '@chakra-ui/react';
import { TriangleDownIcon, StarIcon } from '@chakra-ui/icons';
import Layout from '../../components/Layout';

function Detail() {
  const [movie, setMovie] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [videos, setVideos] = useState(null);

  const videoUrl = videos?.filter(
    (vid) => vid.type === 'Trailer' && vid.site === 'YouTube'
  )[0]?.key;

  const { media, id } = useParams();

  // Destructure null object
  const {
    backdrop_path: backdropPath,
    title,
    original_name: originalName,
    overview,
    release_date: releaseDate,
    vote_average: voteAverage,
    genres,
  } = movie ?? {};

  const getVideo = async (_movieId) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/${media}/${_movieId}/videos?api_key=${
        import.meta.env.VITE_TMDB_API_KEY
      }`
    );
    const result = await response.json();
    setVideos(result?.results);
  };

  useEffect(() => {
    const getDetailMovie = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/${media}/${id}?api_key=${
          import.meta.env.VITE_TMDB_API_KEY
        }&language=en-US`
      );
      const result = await response.json();
      setMovie(result);
    };
    getDetailMovie();
    getVideo(id);
  }, []);

  return (
    <Layout>
      {movie ? (
        <Box
          backgroundImage={`url(https://image.tmdb.org/t/p/original/${backdropPath})`}
          backgroundSize="cover"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          width="100vw"
          height="100vh"
        >
          <Box
            color="white"
            height="100vh"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            background="rgba(0,0,0,0.5)"
          >
            <Flex maxW="xl" m="2rem" flexDir="column" gap="1rem">
              <Heading>{title ?? originalName}</Heading>
              <Text>{releaseDate}</Text>
              <HStack>
                {genres.map((genre) => (
                  <Badge key={genre.id} colorScheme="cyan">
                    {genre.name}
                  </Badge>
                ))}
              </HStack>
              <Text>{overview}</Text>
              <HStack>
                <StarIcon />
                <Text>{voteAverage.toFixed(1)} / 10</Text>
              </HStack>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  onOpen();
                }}
                colorScheme="red"
                width="48"
                rightIcon={<TriangleDownIcon transform="rotate(-90deg)" />}
              >
                WATCH TRAILER
              </Button>
              <Modal isOpen={isOpen} onClose={onClose} size="4xl">
                <ModalOverlay />
                <ModalContent background="rgba(0,0,0, 0.8)" pb="4">
                  <Box color="white">
                    <ModalCloseButton />
                    <ModalHeader>Play Trailer</ModalHeader>
                  </Box>
                  <ModalBody>
                    {videoUrl ? (
                      <AspectRatio maxW="720px" ratio={16 / 9} margin="0 auto">
                        <iframe
                          src={`https://www.youtube.com/embed/${videoUrl}`}
                          title={movie.title ?? movie.name}
                          allow="autoplay; fullscreen;"
                        />
                      </AspectRatio>
                    ) : (
                      <Text color="white">
                        Sorry, we cannot find trailer for this{' '}
                        {media === 'tv' ? 'TV Series' : 'Movie'}
                      </Text>
                    )}
                  </ModalBody>
                </ModalContent>
              </Modal>
            </Flex>
          </Box>
        </Box>
      ) : (
        <Box width="100vw" height="100vh">
          <Box bg="red">
            <Skeleton startColor="pink.500" endColor="orange.500" />
          </Box>
        </Box>
      )}
    </Layout>
  );
}

export default Detail;
