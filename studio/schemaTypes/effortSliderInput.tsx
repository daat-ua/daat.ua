import {useCallback} from 'react'
import {set, unset, type NumberInputProps} from 'sanity'
import {Flex, Stack, Text} from '@sanity/ui'

export function EffortSliderInput(props: NumberInputProps) {
    const {value, onChange} = props
    const numericValue = typeof value === 'number' ? value : 0

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const next = event.currentTarget.value
            onChange(next === '' ? unset() : set(Number(next)))
        },
        [onChange],
    )

    return (
        <Stack space={2}>
            <Flex align="center" gap={3}>
                <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={numericValue}
                    onChange={handleChange}
                    style={{flex: 1}}
                />
                <Text size={1} weight="medium" style={{minWidth: 36, textAlign: 'right'}}>
                    {numericValue}
                </Text>
            </Flex>
        </Stack>
    )
}
