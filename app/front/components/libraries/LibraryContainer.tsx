import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import Loader from 'components/common/Loader'
import Library from 'model/Library'
import { AppState } from 'reducers'
import librariesActions, { LibrariesActions } from 'store/libraries/actions'
import modalActions, { ModalActions, ModalEnum } from 'store/modal/actions'

import { Props as ComponentProps } from './Library'

interface Props {
    id: number

    loading?: boolean
    error?: boolean

    library?: Library

    librariesActions?: LibrariesActions
    modalActions?: ModalActions,
}

export default function(Component: React.ComponentClass<ComponentProps>) {

    type ConatinerProps = Props

    @(connect(mapStateToProps, mapDispatchToProps) as any)
    class Wrapped extends React.Component<ConatinerProps, {}> {

        public render() {
            const {
                id, library, loading, error,
            } = this.props

            return (
                <Loader
                    loading={loading || !library}
                    error={error}
                >
                    {!!library &&
                        <Component
                            library={library}

                            openArticle={this.openArticle}
                            editArticle={this.editArticle}

                            openBook={this.openBook}
                            editBook={this.editBook}
                        />
                    }
                </Loader>
            )
        }

        public componentDidMount() {
            const {
                id, library,
                // tslint:disable-next-line:no-shadowed-variable
                librariesActions,
            } = this.props

            if (id && !library && !!librariesActions && !!librariesActions.get) {
                librariesActions.get(id)
            }
        }

        public openArticle = (id: number) => {
            // tslint:disable-next-line:no-shadowed-variable
            const { modalActions } = this.props

            if (modalActions && modalActions.show) {
                modalActions.show(ModalEnum.ARTICLE_SHOW, id)
            }
        }

        public editArticle = (lib: Library, id?: number) => {
            // tslint:disable-next-line:no-shadowed-variable
            const { modalActions } = this.props

            if (modalActions && modalActions.show) {
                modalActions.show(ModalEnum.ARTICLE_EDIT, id, lib)
            }
        }

        public openBook = (id: number) => {
            // tslint:disable-next-line:no-shadowed-variable
            const { modalActions } = this.props

            if (modalActions && modalActions.show) {
                modalActions.show(ModalEnum.BOOK_SHOW, id)
            }
        }

        public editBook = (lib: Library, id?: number) => {
            // tslint:disable-next-line:no-shadowed-variable
            const { modalActions } = this.props

            if (modalActions && modalActions.show) {
                modalActions.show(ModalEnum.BOOK_EDIT, id, lib)
            }
        }
    }

    return Wrapped
}

const mapStateToProps = (state: AppState, ownProps: Props) => ({
    library: state.libraries.entities.find((v) => v.id === ownProps.id),

    loading: !!state.libraries.get.loading,
    error: !!state.libraries.get.error,
})

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    librariesActions: bindActionCreators(librariesActions, dispatch),
    modalActions: bindActionCreators(modalActions, dispatch),
})
