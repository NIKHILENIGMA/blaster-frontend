import type { FC } from 'react'

import Loader from './loader'

const ContainLoader: FC = () => {
    return (
        <Loader
            size="xl"
            className="min-h-screen"
        />
    )
}

export default ContainLoader
