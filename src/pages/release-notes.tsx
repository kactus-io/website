import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'
import Header from '../components/header'
import Loader from '../components/loader'

import './release-notes.css'

const tagColor = {
  improved: '#0366d6',
  fixed: '#d73a49',
  new: '#3EAD3F',
}

const Index = () => {
  const [loading, setLoading] = React.useState(true)
  const [notes, setNotes] = React.useState<
    {
      badge: string
      items: { tag: string; tagColor: string; note: string }[]
    }[]
  >([])

  React.useEffect(() => {
    fetch(
      'https://api.github.com/repos/kactus-io/kactus/contents/changelog.json'
    )
      .then(res => res.json())
      .then(res => JSON.parse(window.atob(res.content)))
      .then(res => {
        setNotes(
          Object.keys(res.releases).map(k => ({
            badge: k,
            items: res.releases[k].map((x: string) => {
              const parts = x.split(']')
              const tag = parts
                .shift()
                .replace('[', '')
                .trim()
                .toLowerCase()
              const note = parts.join(']').trim()
              return {
                tag,
                note,
                tagColor: tagColor[tag] || '#3EAD3F',
              }
            }),
          }))
        )
        setLoading(false)
      })
      .then(console.log)
      .catch(console.error)
  }, [])

  return (
    <Layout>
      <SEO />
      <Header current="release-notes" />
      <div className="container text-center hero">
        <h1>Release notes for Kactus</h1>
        <hr />
        <div id="notes">
          {loading ? (
            <Loader />
          ) : (
            notes.map(x => (
              <section className="release-note" key={x.badge}>
                <div className="release-note__header">
                  <span className="badge">{x.badge}</span>
                </div>
                <ul className="release-note__notes">
                  {x.items.map(n => (
                    <li key={n.note} className="note">
                      <div className="badge" style={{ background: n.tagColor }}>
                        {n.tag}
                      </div>
                      <div className="description">{n.note}</div>
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </div>
      </div>
      <hr />
    </Layout>
  )
}

export default Index
