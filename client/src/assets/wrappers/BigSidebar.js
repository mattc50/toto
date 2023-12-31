import styled from 'styled-components'

const Wrapper = styled.aside`
  display: none;
  @media (min-width: 992px) {
    display: block;
    box-shadow: 1px 0px 0px 0px rgba(0, 0, 0, 0.1);
    .sidebar-container {
      background: var(--white);
      min-height: 100vh;
      height: 100%;
      width: 250px;
      margin-left: -250px;
      
      -webkit-transition: var(--transition);
      -moz-transition: var(--transition);
      -ms-transition: var(--transition);
      transition: var(--transition);
    }

    .content {
      position: sticky;
      top: 0;
    }
    .show-sidebar {
      margin-left: 0;
    }
    header {
      height: 6rem;
      display: flex;
      align-items: center;
      padding-left: 2.5rem;
    }
    .nav-links {
      padding-top: 2rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .nav-link {
      display: flex;
      align-items: center;
      color: var(--grey-500);
      padding: 1rem 0;
      padding-left: 1.5rem;
      border-radius: var(--borderRadius);
      margin: 0 1rem;
      text-transform: capitalize;
      outline-offset: 0;
      outline: 1px transparent;
      
      -webkit-transition: var(--transition);
      -moz-transition: var(--transition);
      -ms-transition: var(--transition);
      transition: var(--transition);
    }
    .nav-link:is(:hover, :active, :focus, :focus-visible) {
      background: var(--primary-50);
      padding-left: 2rem;
      color: var(--grey-900);
      outline: 1px solid var(--primary-100);
    }
    .nav-link:is(:hover, :focus, :focus-visible) .icon {
      color: var(--primary-500);
    }
    .icon {
      font-size: 1.5rem;
      margin-right: 1rem;
      display: grid;
      place-items: center;

      -webkit-transition: var(--transition);
      -moz-transition: var(--transition);
      -ms-transition: var(--transition);
      transition: var(--transition);
    }
    .active {
      color: var(--grey-900);
    }
    .active .icon {
      color: var(--primary-400);
    }
  }
`
export default Wrapper
