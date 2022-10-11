import {Button} from '@chakra-ui/button'
import {Input} from '@chakra-ui/input'
import {Box, Divider, Heading, VStack} from '@chakra-ui/layout'
import React, {useState} from 'react'
import {
    atom,
    atomFamily,
    DefaultValue,
    useRecoilCallback,
    useRecoilState,
    useRecoilValue,
    useResetRecoilState,
} from 'recoil'
import {shoppingListAPI} from './shippingAPI'

type ItemType = {
    label: string
    checked: boolean
}

const idsState = atom<number[]>({
    key: 'ids',
    default: [],
    effects_UNSTABLE: [
        ({setSelf}) => {
            const itemsPromise = shoppingListAPI.getItems().then((items) => {
                return Object.keys(items).map((id) => parseInt(id))
            })
            setSelf(itemsPromise)
        },
    ],
})

const itemState = atomFamily<ItemType, number>({
    key: 'item',
    default: {label: '', checked: false},
    effects_UNSTABLE: (id) => [
        ({onSet, setSelf}) => {
            const itemPromise = shoppingListAPI.getItem(id).then((item) => {
                if (item === undefined) return new DefaultValue()
                else return item
            })
            setSelf(itemPromise)

            onSet((item) => {
                if (item instanceof DefaultValue) {
                    shoppingListAPI.deleteItem(id)
                } else {
                    shoppingListAPI.createOrUpdateItem(id, item)
                }
            })
        },
    ],
})

export const AsyncEffects = () => {
    const ids = useRecoilValue(idsState)
    const resetList = useResetRecoilState(idsState)
    const nextId = ids.length

    const insertItem = useRecoilCallback(({set}) => (label: string) => {
        set(idsState, [...ids, nextId])
        set(itemState(nextId), {label, checked: false})
    })

    return (
        <Container onClear={() => resetList()}>
            {ids.map((id) => (
                <Item key={id} id={id} />
            ))}
            <NewItemInput
                onInsert={(label) => {
                    insertItem(label)
                }}
            />
        </Container>
    )
}

const Container: React.FC<{onClear: () => void}> = ({children, onClear}) => {
    return (
        <Box display="flex" flexDir="column" alignItems="center" pt={10}>
            <Box width="400px" backgroundColor="yellow.100" p={5} borderRadius="lg">
                <Heading size="lg" mb={4}>
                    Shopping List
                </Heading>
                <VStack spacing={3} divider={<Divider borderColor="rgba(86, 0, 0, 0.48)" />}>
                    {children}
                </VStack>
            </Box>
            <Button variant="link" mt={3} onClick={onClear}>
                Clear list
            </Button>
        </Box>
    )
}

type ItemProps = {
    id: number
}

const Item = ({id}: ItemProps) => {
    const [item, setItem] = useRecoilState(itemState(id))

    return (
        <Box
            rounded="md"
            textDecoration={item.checked ? 'line-through' : ''}
            opacity={item.checked ? 0.5 : 1}
            _hover={{textDecoration: 'line-through'}}
            cursor="pointer"
            width="100%"
            onClick={() => setItem({...item, checked: !item.checked})}
        >
            {item.label}
        </Box>
    )
}

const NewItemInput = ({onInsert}: {onInsert: (label: string) => void}) => {
    const [value, setValue] = useState('')

    return (
        <Input
            value={value}
            placeholder="New item"
            padding={0}
            height="auto"
            border="none"
            _focus={{border: 'none'}}
            _placeholder={{color: 'rgba(86, 0, 0, 0.48)'}}
            onChange={(e) => {
                setValue(e.currentTarget.value)
            }}
            onKeyPress={({key}) => {
                if (key === 'Enter') {
                    onInsert(value)
                    setValue('')
                }
            }}
        />
    )
}
