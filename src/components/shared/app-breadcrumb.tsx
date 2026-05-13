import { Fragment, type FC } from 'react'
import { Link } from 'react-router'

import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { cn } from '@/shared/lib/utils'

type BreadcrumbItemConfig = {
    label: string
    to?: string
}

type AppBreadcrumbProps = {
    items: BreadcrumbItemConfig[]
    className?: string
}

const AppBreadcrumb: FC<AppBreadcrumbProps> = ({ items, className }) => {
    if (items.length === 0) return null

    const firstItem = items[0]
    const middleItems = items.slice(1, -1)
    const lastItem = items[items.length - 1]
    const shouldCollapseOnMobile = items.length > 2

    return (
        <Breadcrumb className={cn('w-full', className)}>
            <BreadcrumbList className="text-xs sm:text-sm">
                <BreadcrumbItem>
                    {firstItem.to ? (
                        <BreadcrumbLink asChild>
                            <Link to={firstItem.to}>{firstItem.label}</Link>
                        </BreadcrumbLink>
                    ) : (
                        <BreadcrumbPage>{firstItem.label}</BreadcrumbPage>
                    )}
                </BreadcrumbItem>

                {middleItems.map((item) => (
                    <Fragment key={`${item.label}-${item.to ?? 'current'}`}>
                        <BreadcrumbSeparator className={cn(shouldCollapseOnMobile && 'hidden sm:flex')} />
                        <BreadcrumbItem className={cn(shouldCollapseOnMobile && 'hidden sm:inline-flex')}>
                            {item.to ? (
                                <BreadcrumbLink asChild>
                                    <Link to={item.to}>{item.label}</Link>
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                    </Fragment>
                ))}

                {shouldCollapseOnMobile ? (
                    <>
                        <BreadcrumbSeparator className="sm:hidden" />
                        <BreadcrumbItem className="sm:hidden">
                            <BreadcrumbEllipsis className="size-5" />
                        </BreadcrumbItem>
                    </>
                ) : null}

                {items.length > 1 ? (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="max-w-[12rem] truncate font-medium sm:max-w-none">{lastItem.label}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                ) : null}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default AppBreadcrumb
