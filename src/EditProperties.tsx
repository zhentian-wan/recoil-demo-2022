import {InputGroup, InputRightElement, NumberInput, NumberInputField, Text, VStack} from '@chakra-ui/react'
import {selectorFamily, useRecoilState, useRecoilValue} from 'recoil'
import {selectElementAtom} from './Canvas'
import {elementAtom} from './components/Rectangle/Rectangle'
import {get as lodash_get, set as lodash_set} from 'lodash'
import produce from 'immer'
import {Suspense} from 'react'
import {ImageInfo, ImageInfoFallback} from './components/ImageInfo'

export const editPropertiesState = selectorFamily<any, {path: string; id: number}>({
    key: 'editPropertiesState',
    get:
        ({path, id}) =>
        ({get}) => {
            const element = get(elementAtom(id))
            return lodash_get(element, path)
        },
    set:
        ({path, id}) =>
        ({get, set}, newValue) => {
            const element = get(elementAtom(id))
            const newElement = produce(element, (draft) => {
                lodash_set(draft, path, newValue)
            })
            set(elementAtom(id), newElement)
        },
})

export const editSize = selectorFamily<any, {dimension: 'width' | 'height'; id: number}>({
    key: 'editSize',
    get:
        ({dimension, id}) =>
        ({get}) => {
            return get(editPropertiesState({path: `style.size.${dimension}`, id}))
        },
    set:
        ({dimension, id}) =>
        ({set, get}, newValue) => {
            const hasImage = get(editPropertiesState({path: 'image', id})) !== undefined
            if (!hasImage) {
                set(editPropertiesState({path: `style.size.${dimension}`, id}), newValue)
                return
            }
            const size = editPropertiesState({path: `style.size`, id})
            const {width, height} = get(size)
            const aspectRatio = width / height
            if (dimension === 'width') {
                set(size, {
                    width: newValue,
                    height: Math.round(newValue / aspectRatio),
                })
            } else {
                set(size, {
                    height: newValue,
                    width: Math.round(newValue * aspectRatio),
                })
            }
        },
})

export const EditProperties = () => {
    const selectedElement = useRecoilValue(selectElementAtom)
    if (selectedElement == null) {
        return null
    }
    return (
        <Card>
            <Section heading="Position">
                <Property id={selectedElement} label="Top" path="style.position.top" />
                <Property id={selectedElement} label="Left" path="style.position.left" />
            </Section>
            <Section heading="Size">
                <SizeProperty id={selectedElement} label="Width" dimension="width" />
                <SizeProperty id={selectedElement} label="Height" dimension="height" />
            </Section>
            <Section heading="Image">
                <Suspense fallback={<ImageInfoFallback />}>
                    <ImageInfo></ImageInfo>
                </Suspense>
            </Section>
        </Card>
    )
}

const Section: React.FC<{heading: string}> = ({heading, children}) => {
    return (
        <VStack spacing={2} align="flex-start">
            <Text fontWeight="500">{heading}</Text>
            {children}
        </VStack>
    )
}

const Property = ({label, path, id}: {label: string; path: string; id: number}) => {
    const [value, setValue] = useRecoilState(editPropertiesState({path, id}))
    return <PropertyInput value={value} label={label} onChange={setValue}></PropertyInput>
}

const SizeProperty = ({label, dimension, id}: {label: string; dimension: 'width' | 'height'; id: number}) => {
    const [value, setValue] = useRecoilState(editSize({dimension, id}))
    return <PropertyInput value={value} label={label} onChange={setValue}></PropertyInput>
}

const PropertyInput = ({label, value, onChange}: {label: string; value: number; onChange: (value: number) => void}) => {
    return (
        <div>
            <Text fontSize="14px" fontWeight="500" mb="2px">
                {label}
            </Text>
            <InputGroup size="sm" variant="filled">
                <NumberInput value={value} onChange={(_, value) => onChange(value)}>
                    <NumberInputField borderRadius="md" />
                    <InputRightElement pointerEvents="none" children="px" lineHeight="1" fontSize="12px" />
                </NumberInput>
            </InputGroup>
        </div>
    )
}

const Card: React.FC = ({children}) => (
    <VStack
        position="absolute"
        top="20px"
        right="20px"
        backgroundColor="white"
        padding={2}
        boxShadow="md"
        borderRadius="md"
        spacing={3}
        align="flex-start"
        onClick={(e) => e.stopPropagation()}
    >
        {children}
    </VStack>
)
