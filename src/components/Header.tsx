import React from 'react'

export function Header(props: { header: string }) {
  console.log(props)

  return <h1>{props.header}</h1>
}
