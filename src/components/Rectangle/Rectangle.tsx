import {Suspense} from 'react'
import {atomFamily, useRecoilState} from 'recoil'
import {selectElementAtom} from '../../Canvas'
import {Drag} from '../Drag'
import {Resize} from '../Resize'
import {RectangleContainer} from './RectangleContainer'
import {RectangleInner} from './RectangleInner'
import {RectangleLoading} from './RectangleLoading'

export type ElementStyle = {
    position: {top: number; left: number}
    size: {width: number; height: number}
}

export type Element = {style: ElementStyle; image?: {id: number; src: string}}

export const defaultStyle = {
    position: {top: 0, left: 0},
    size: {width: 200, height: 200},
}
export const elementAtom = atomFamily<Element, number>({
    key: 'elementState',
    default: {
        style: defaultStyle,
    },
})

export const Rectangle = ({id}: {id: number}) => {
    const [selectedElement, setSelectedElement] = useRecoilState(selectElementAtom)
    const [element, setElement] = useRecoilState(elementAtom(id))
    const selected = id === selectedElement
    return (
        <RectangleContainer
            position={element.style.position}
            size={element.style.size}
            onSelect={() => {
                setSelectedElement(id)
            }}
        >
            <Resize
                lockAspectRatio={element.image !== undefined}
                selected={selected}
                position={element.style.position}
                size={element.style.size}
                onResize={(style) =>
                    setElement({
                        ...element,
                        style,
                    })
                }
            >
                <Drag
                    position={element.style.position}
                    onDrag={(position) => {
                        setElement({
                            ...element,
                            style: {
                                ...element.style,
                                position,
                            },
                        })
                    }}
                >
                    <div>
                        <Suspense fallback={<RectangleLoading selected={selected}></RectangleLoading>}>
                            <RectangleInner selected={selected} id={id} />
                        </Suspense>
                    </div>
                </Drag>
            </Resize>
        </RectangleContainer>
    )
}
