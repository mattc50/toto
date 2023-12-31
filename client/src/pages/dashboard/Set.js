import React, { useEffect, useState } from "react"
import { useAppContext } from "../../context/appContext"
import { TextArea, TodosContainer, Loading, SetNameInput } from "../../components"
import { useParams } from "react-router-dom"
import SkeletonLoad from "../../components/SkeletonLoad"
// import Wrapper from '../../assets/wrappers/SetPage'

const Set = () => {
  const {
    getSet,
    set,
    setFound,
    setLoading,
    sets
  } = useAppContext()

  const [initialLoad, setInitialLoad] = useState(true)

  const asyncFetch = async (setId) => {
    await getSet(setId)
    setInitialLoad(false)
  }

  const setId = useParams().id || set._id;

  useEffect(() => {
    asyncFetch(setId);
    // eslint-disable-next-line
  }, [setFound])

  return (
    <React.Fragment>
      {setLoading &&
        <div
          className="loading-container"
          // if the sets array state has already been changed as a result of it
          // being loaded in, the loader height will be adjusted for the navbar.
          // page === 'set' has been omitted since the loader is only implemented
          // in the Set page.
          style={sets.length === 0 ?
            { height: "calc(100vh - var(--nav-height))" } :
            { height: "calc(100vh - var(--nav-height) - 4rem)" }
          }
        >
          <Loading center />
        </div>
      }
      {initialLoad && !setLoading && // !set &&
        <SkeletonLoad context="setName" />
      }
      {!initialLoad && !setLoading && set &&
        < div className="name-container">
          <SetNameInput set={set} />
          <small className="set-id">{`ID: ${setId}`}</small>
        </div>
      }
      {
        !initialLoad && !setLoading &&
        <TodosContainer set={set} />
      }
      {
        !initialLoad && !setLoading &&
        <TextArea
          type='text'
          name="Feel free to write any additional comments!"
        >
        </TextArea>
      }
    </React.Fragment >
  )
}

export default Set