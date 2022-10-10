import {Container, Heading, Text} from '@chakra-ui/layout'
import {Button} from '@chakra-ui/react'
import {Select} from '@chakra-ui/select'
import {Suspense, useState} from 'react'
import {ErrorBoundary, FallbackProps} from 'react-error-boundary'
import {useRecoilValue, selectorFamily, atomFamily, useSetRecoilState} from 'recoil'
import {getWeather} from './fakeAPI'

const userState = selectorFamily({
    key: 'user',
    get: (userId: number) => async () => {
        const userData = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`).then((res) => res.json())
        if (userId === 4) {
            throw new Error('User does not exists')
        }
        return userData
    },
})

const weatherState = selectorFamily({
    key: 'weather',
    get:
        (userId: number) =>
        async ({get}) => {
            get(weatherRequestIdState(userId))
            const user = get(userState(userId))
            const weather = await getWeather(user.address.city)
            return weather
        },
})

// #region refetch
/* Refetch request by using selector */
// 1. create a request Id atom
const weatherRequestIdState = atomFamily({
    key: 'weatherRequestId',
    default: 0,
})
// 2. create a custom hook to increase the request id
const useRefetchWeather = (userId: number) => {
    const setRequestId = useSetRecoilState(weatherRequestIdState(userId))
    return () => setRequestId((id) => id + 1)
}
// 3. call get(weatherRequestIdState(userId)) in selectFamily where requrest need to be refetch
// 4. Use useRefetchWeather(userId) hook
// #endregion
export const UserWeather = ({userId}: {userId: number}) => {
    const weather = useRecoilValue(weatherState(userId))
    const userData = useRecoilValue(userState(userId))
    const refetch = useRefetchWeather(userId)
    return (
        <>
            <Text>
                <b>Weather for {userData.address.city}: </b> {weather} C
            </Text>
            <Text onClick={refetch}>(Refresh weather)</Text>
        </>
    )
}

export const UserData = ({userId}: {userId: number}) => {
    const userData = useRecoilValue(userState(userId))
    return (
        <div>
            <Heading as="h2" size="md" mb={1}>
                User data:
            </Heading>
            <Text>
                <b>Name:</b> {userData.name}
            </Text>
            <Text>
                <b>Phone:</b> {userData.phone}
            </Text>
            <Suspense fallback={<span>Loading weather...</span>}>
                <UserWeather userId={userId} />
            </Suspense>
        </div>
    )
}

const ErrorFallback = ({error, resetErrorBoundary}: FallbackProps) => {
    return (
        <div>
            <Heading as="h2" size="md" mb={1}>
                Something went wrong
            </Heading>
            <Text>{error.message}</Text>
            <Button onClick={resetErrorBoundary}>OK</Button>
        </div>
    )
}

export const Async = () => {
    const [userId, setUserId] = useState<number | undefined>(undefined)

    return (
        <Container py={10}>
            <Heading as="h1" mb={4}>
                View Profile
            </Heading>
            <Heading as="h2" size="md" mb={1}>
                Choose a user:
            </Heading>
            <Select
                placeholder="Choose a user"
                mb={4}
                value={userId}
                onChange={(event) => {
                    const value = event.target.value
                    setUserId(value ? parseInt(value) : undefined)
                }}
            >
                <option value="1">User 1</option>
                <option value="2">User 2</option>
                <option value="3">User 3</option>
                <option value="4">User 4</option>
            </Select>
            {userId !== undefined && (
                <ErrorBoundary
                    FallbackComponent={ErrorFallback}
                    onReset={() => setUserId(undefined)}
                    resetKeys={[userId]}
                >
                    <Suspense fallback={<div>loading...</div>}>
                        <UserData userId={userId} />
                    </Suspense>
                </ErrorBoundary>
            )}
        </Container>
    )
}
