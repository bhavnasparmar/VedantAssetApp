import React from 'react';
import { TouchableOpacity } from 'react-native';
import Wrapper from './wrapper';
import CusText from './custom-text';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { colors, responsiveWidth, borderRadius } from '../styles/variables';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalCount?: number;
    itemsPerPage?: number;
    maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    totalCount,
    itemsPerPage = 25,
    maxVisiblePages = 5
}) => {
    if (totalPages <= 1) return null;

    const renderPaginationNumbers = () => {
        const pages = [];
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust start page if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Add first page and ellipsis if needed
        if (startPage > 1) {
            pages.push(
                <TouchableOpacity
                    key={1}
                    activeOpacity={0.7}
                    onPress={() => onPageChange(1)}
                    style={{
                        paddingHorizontal: responsiveWidth(2),
                        paddingVertical: responsiveWidth(2),
                        borderRadius: borderRadius.middleSmall,
                        borderWidth: 1,
                        borderColor: colors.paginationborder,
                        backgroundColor: colors.white,
                        minWidth: responsiveWidth(10),
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <CusText text="1" size="SS" color={colors.Hard_Black} />
                </TouchableOpacity>
            );

            if (startPage > 2) {
                pages.push(
                    <CusText key="ellipsis1" text="..." size="SS" color={colors.gray} />
                );
            }
        }

        // Add visible page numbers
        for (let i = startPage; i <= endPage; i++) {
            const isCurrentPage = i === currentPage;
            pages.push(
                <TouchableOpacity
                    key={i}
                    activeOpacity={0.7}
                    onPress={() => onPageChange(i)}
                    style={{
                        paddingHorizontal: responsiveWidth(2),
                        paddingVertical: responsiveWidth(1),
                        borderRadius: borderRadius.middleSmall,
                        borderWidth: 1,
                        borderColor: isCurrentPage ? colors.primary : colors.paginationborder,
                        backgroundColor: isCurrentPage ? colors.paginationselected : colors.white,
                        minWidth: responsiveWidth(10),
                        alignItems: 'center'
                    }}
                >
                    <CusText 
                        text={i.toString()} 
                        size="SS" 
                        color={isCurrentPage ? colors.primary : colors.Hard_Black}
                        bold={isCurrentPage}
                    />
                </TouchableOpacity>
            );
        }

        // Add last page and ellipsis if needed
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(
                    <CusText key="ellipsis2" text="..." size="SS" color={colors.gray} />
                );
            }

            pages.push(
                <TouchableOpacity
                    key={totalPages}
                    activeOpacity={0.7}
                    onPress={() => onPageChange(totalPages)}
                    style={{
                        paddingHorizontal: responsiveWidth(2),
                        paddingVertical: responsiveWidth(1),
                        borderRadius: borderRadius.middleSmall,
                        borderWidth: 1,
                        borderColor: colors.paginationborder,
                        backgroundColor: colors.white,
                        minWidth: responsiveWidth(10),
                        alignItems: 'center'
                    }}
                >
                    <CusText text={totalPages.toString()} size="SS" color={colors.Hard_Black} />
                </TouchableOpacity>
            );
        }

        return pages;
    };

    return (
        <Wrapper customStyles={{ paddingVertical: responsiveWidth(0) }}>
            <Wrapper row justify="center" align="center" customStyles={{ gap: responsiveWidth(1.5) }}>
                {/* Previous Button */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                        padding: responsiveWidth(1.5),
                        borderRadius: borderRadius.middleSmall,
                        borderWidth: 1,
                        borderColor: currentPage === 1 ? colors.gray : colors.paginationborder,
                        backgroundColor: colors.white,
                        opacity: currentPage === 1 ? 0.5 : 1
                    }}
                >
                    <IonIcon
                        name="chevron-back"
                        size={responsiveWidth(4)}
                        color={currentPage === 1 ? colors.gray : colors.Hard_Black}
                    />
                </TouchableOpacity>

                {/* Page Numbers */}
                {renderPaginationNumbers()}

                {/* Next Button */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                        padding: responsiveWidth(1.5),
                        borderRadius: borderRadius.middleSmall,
                        borderWidth: 1,
                        borderColor: currentPage === totalPages ? colors.gray : colors.paginationborder,
                        backgroundColor: colors.white,
                        opacity: currentPage === totalPages ? 0.5 : 1
                    }}
                >
                    <IonIcon
                        name="chevron-forward"
                        size={responsiveWidth(4)}
                        color={currentPage === totalPages ? colors.gray : colors.Hard_Black}
                    />
                </TouchableOpacity>
            </Wrapper>

            {/* Page Info */}
            <Wrapper align="center" customStyles={{ marginTop: responsiveWidth(2) }}>
                <CusText
                    text={`Page ${currentPage} of ${totalPages}${totalCount ? ` (${totalCount} total items)` : ''}`}
                    size="S"
                    color={colors.gray}
                />
            </Wrapper>
        </Wrapper>
    );
};

export default Pagination;
