import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../gen/gql';
import { isServer } from '../utils/isServer';
import { useRouter } from 'next/router';
import { useApolloClient } from '@apollo/client';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
	const router = useRouter();
	const [logout, { loading: logoutFetching }] = useLogoutMutation();
	const apolloClient = useApolloClient();
	const { data, loading } = useMeQuery({ skip: isServer() });
	let body = null;

	if (loading) {
	} else if (!data?.me) {
		body = (
			<>
				<NextLink href='/login'>
					<Link mr={2}>login</Link>
				</NextLink>
				<NextLink href='/register'>
					<Link mr={2}>register</Link>
				</NextLink>
			</>
		);
	} else {
		body = (
			<Flex align='center'>
				<NextLink href='/create-post'>
					<Button
						as={Link}
						mr={4}
						colorScheme='twitter'
						variant='solid'
						bg='white'
					>
						create post
					</Button>
				</NextLink>
				<Box mr={2}>{data.me.username}</Box>
				<Button
					onClick={async () => {
						await logout();
						await apolloClient.resetStore();
					}}
					isLoading={logoutFetching}
					variant='link'
				>
					logout
				</Button>
			</Flex>
		);
	}

	return (
		<Flex
			zIndex={1}
			position='sticky'
			top={0}
			bg='twitter.300'
			p={4}
			align='center'
		>
			<Flex flex={1} m='auto' align='center' maxW={800}>
				<NextLink href='/'>
					<Link>
						<Heading>LiReddit</Heading>
					</Link>
				</NextLink>
				<Box ml={'auto'}>{body}</Box>
			</Flex>
		</Flex>
	);
};
