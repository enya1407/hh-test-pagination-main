import Head from "next/head";
import {Inter} from "next/font/google";
import Table from "react-bootstrap/Table";
import {Alert, Container} from "react-bootstrap";
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {usePathname, useSearchParams} from "next/navigation";
import Pagination from "react-bootstrap/Pagination";

const inter = Inter({subsets: ["latin"]});

type TUserItem = {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  updatedAt: string
}

type TGetServerSideProps = {
  statusCode: number
  users: TUserItem[]
  page: number
  totalPages: number
}

const USERS_PER_PAGE = 20

export const getServerSideProps = (async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
  const currPage = Number(ctx.query.page) || 1

  try {
    const res = await fetch(`http://localhost:3000/users/${currPage} ${USERS_PER_PAGE}`, {method: 'GET'})

    if (!res.ok) {
      return {props: {statusCode: res.status, users: [], page: currPage, totalPages: 0}}
    }

    const {users, totalCount} = await res.json()

    return {
      props: {statusCode: 200, users, page: currPage, totalPages: Math.ceil(totalCount / USERS_PER_PAGE)}
    }
  } catch (e) {
    return {props: {statusCode: 500, users: [], page: currPage, totalPages: 0}}
  }
}) satisfies GetServerSideProps<TGetServerSideProps>

export default function Home({statusCode, users, page, totalPages}: TGetServerSideProps) {
  if (statusCode !== 200) {
    return <Alert variant={'danger'}>Ошибка {statusCode} при загрузке данных</Alert>
  }
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const {replace} = useRouter();

  params.set('page', page.toString())

  const initDisplayedPagesNumbers = Array.from(Array(10), (_, i) => page === 1 ? i + page : i + page - 1)

  const [displayedPagesNumber, setDisplayedPagesNumber] = useState(initDisplayedPagesNumbers)

  useEffect(() => {
    if (page > totalPages - 9) {
      replace(`${pathname}?${params.toString()}`)
      setDisplayedPagesNumber(Array.from(Array(10), (_, i) => totalPages - 9 + i))
      return page > totalPages ? params.set('page', totalPages.toString()) : params.set('page', page.toString())
    } else if (page === 1) {
      replace(`${pathname}?${params.toString()}`)
    }
  }, [page])

  const handleClick = (el: number) => {
    params.set('page', el.toString());
    replace(`${pathname}?${params.toString()}`)
  }

  const handleClickFirst = () => {
    params.set('page', "1");
    replace(`${pathname}?${params.toString()}`)
    setDisplayedPagesNumber(Array.from(Array(10), (_, i) => i + 1))
  }

  const handleClickLast = () => {
    params.set('page', totalPages.toString());
    replace(`${pathname}?${params.toString()}`)
    setDisplayedPagesNumber(Array.from(Array(10), (_, i) => totalPages - 9 + i))
  }

  const handleClickNext = () => {
    const newPage = page + 1
    const offset = displayedPagesNumber[8]
    params.set('page', String(newPage));
    replace(`${pathname}?${params.toString()}`)
    if (newPage > offset && newPage < totalPages) {
      const newDisplayedPagesNumber = displayedPagesNumber.map(el => el + newPage - offset)
      setDisplayedPagesNumber(newDisplayedPagesNumber)
    }
  }

  const handleClickPrev = () => {
    const newPage = page - 1
    const offset = displayedPagesNumber[1]
    params.set('page', String(newPage));
    replace(`${pathname}?${params.toString()}`)
    if (newPage < offset && newPage > 1) {
      const newDisplayedPagesNumber = displayedPagesNumber.map(el => el - offset + newPage)
      setDisplayedPagesNumber(newDisplayedPagesNumber)
    }
  }

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={'mb-5'}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Дата обновления</th>
            </tr>
            </thead>
            <tbody>
            {
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))
            }
            </tbody>
          </Table>
          <Pagination>
            <Pagination.First disabled={page === 1} onClick={handleClickFirst}/>
            <Pagination.Prev disabled={page === 1} onClick={handleClickPrev}/>
            {displayedPagesNumber.map(el => <Pagination.Item key={el} active={page === el}
                                                             onClick={() => handleClick(el)}>{el}</Pagination.Item>)}
            <Pagination.Next disabled={page === totalPages} onClick={handleClickNext}/>
            <Pagination.Last disabled={page === totalPages} onClick={handleClickLast}/>
          </Pagination>
        </Container>
      </main>
    </>
  );
}

