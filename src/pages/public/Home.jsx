import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Atom,
  BookMarked,
  BookOpen,
  Building2,
  CircuitBoard,
  Cpu,
  FileText,
  FlaskConical,
  Gauge,
  Images,
  LibraryBig,
  MapPin,
  PlayCircle,
  Search,
  Settings2,
  Shirt,
  Zap,
  X
} from 'lucide-react';

import { useLibrary } from '../../context/LibraryContext';
import {
  SectionTitle,
  QuickCard,
  Empty,
  Reveal
} from '../../components/site';

const deptIcons = {
  electronics: CircuitBoard,
  textile: Shirt,
  civil: Building2,
  electrical: Zap,
  instrumentation: Gauge,
  production: Settings2,
  chemical: FlaskConical,
  mechanical: Settings2,
  'information-technology': Cpu,
  'computer-science': Atom
};

function normalise(value = '') {
  return value
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function Home() {
  const {
    site,
    books,
    announcements,
    departments,
    publications
  } = useLibrary();

  const [query, setQuery] = useState('');
  const [papers, setPapers] = useState([]);

  const [papersLoading, setPapersLoading] =
    useState(false);

  const loadQuestionPapers = async () => {
    if (papers.length) {
      return papers;
    }

    setPapersLoading(true);

    try {
      const response = await fetch(
        '/question-paper-index.json',
        {
          cache: 'no-store'
        }
      );

      if (!response.ok) {
        throw new Error(
          `Question-paper index returned ${response.status}`
        );
      }

      const data = await response.json();

      const nextPapers = Array.isArray(
        data.papers
      )
        ? data.papers
        : [];

      setPapers(nextPapers);

      return nextPapers;
    } catch (error) {
      console.error(
        'HOME_QUESTION_PAPER_SEARCH_ERROR',
        error
      );

      setPapers([]);

      return [];
    } finally {
      setPapersLoading(false);
    }
  };

  useEffect(() => {
    if (query.trim()) {
      loadQuestionPapers();
    }
  }, [query]);

  const searchResults = useMemo(() => {
    const normalizedQuery =
      normalise(query);

    if (!normalizedQuery) {
      return {
        books: [],
        papers: [],
        publications: []
      };
    }

    const matchingBooks = books
      .filter((book) => {
        const haystack = normalise(
          `${book.title || ''} ${
            book.author || ''
          } ${book.department || ''}`
        );

        return haystack.includes(
          normalizedQuery
        );
      })
      .slice(0, 5);

    const matchingPapers = papers
      .filter((paper) => {
        const haystack = normalise(
          `${paper.subject || ''} ${
            paper.filename || ''
          } ${paper.exam || ''} ${
            paper.programme || ''
          } ${paper.department || ''} ${
            paper.year || ''
          } ${paper.semester || ''}`
        );

        return haystack.includes(
          normalizedQuery
        );
      })
      .slice(0, 5);

    const matchingPublications =
      publications
        .filter((publication) => {
          const haystack = normalise(
            `${publication.title || ''} ${
              publication.author || ''
            } ${
              publication.description || ''
            } ${
              publication.department || ''
            } ${
              publication.publisher || ''
            } ${publication.year || ''}`
          );

          return haystack.includes(
            normalizedQuery
          );
        })
        .slice(0, 5);

    return {
      books: matchingBooks,
      papers: matchingPapers,
      publications: matchingPublications
    };
  }, [
    books,
    papers,
    publications,
    query
  ]);

  const hasSearch =
    query.trim().length > 0;

  const hasResults =
    searchResults.books.length > 0 ||
    searchResults.papers.length > 0 ||
    searchResults.publications.length >
      0;

  const search = () => {
    if (!query.trim()) {
      return;
    }

    /*
     * Results are already displayed directly
     * below the search bar.
     *
     * Keep the function so the existing
     * Search button and Enter key continue
     * to work naturally.
     */
    loadQuestionPapers();
  };

  const clearSearch = () => {
    setQuery('');
  };

  return (
    <div className="home-page">
      <section className="hero">
        <img
          src={
            site?.heroImage ||
            '/images/library-hero.webp'
          }
          alt="Central Library, Shri Guru Gobind Singhji Institute of Engineering & Technology, Nanded"
        />

        <div className="hero-overlay" />
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />

        <div className="container hero-inner">
          <div className="hero-copy hero-animate">
            <span className="eyebrow light">
              SHRI GURU GOBIND SINGHJI INSTITUTE
              OF ENGINEERING &amp; TECHNOLOGY ·
              NANDED
            </span>

            <h1>
              {site?.heroTitle ||
                'Knowledge. Discovery. Innovation.'}
            </h1>

            <p>
              {site?.heroSubtitle ||
                'A modern academic gateway to books, digital resources, examination archives and faculty publications.'}
            </p>

            <div className="hero-search-wrap">
              <div className="hero-search">
                <Search />

                <input
                  value={query}
                  onChange={(event) =>
                    setQuery(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === 'Enter'
                    ) {
                      search();
                    }
                  }}
                  placeholder="Search books, question papers, publications..."
                />

                {query && (
                  <button
                    type="button"
                    className="search-clear"
                    onClick={clearSearch}
                    title="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={search}
                >
                  Search
                </button>
              </div>

              {hasSearch && (
                <div className="home-search-results">
                  <div className="home-search-header">
                    <strong>
                      Search results
                    </strong>

                    <span>
                      for "{query}"
                    </span>
                  </div>

                  {papersLoading &&
                  !hasResults ? (
                    <div className="home-search-empty">
                      <Search size={18} />
                      <span>
                        Searching library
                        resources...
                      </span>
                    </div>
                  ) : !hasResults ? (
                    <div className="home-search-empty">
                      <Search size={18} />
                      <span>
                        No results found
                      </span>
                    </div>
                  ) : (
                    <>
                      {searchResults.books
                        .length > 0 && (
                        <div className="home-search-group">
                          <div className="home-search-group-title">
                            <BookOpen
                              size={16}
                            />
                            <span>
                              Catalogue
                            </span>
                          </div>

                          {searchResults.books.map(
                            (book) => (
                              <Link
                                key={book.id}
                                to={`/catalogue/book/${book.id}`}
                                className="home-search-result"
                              >
                                <div>
                                  <strong>
                                    {book.title}
                                  </strong>

                                  <small>
                                    by{' '}
                                    {book.author ||
                                      'Unknown author'}
                                  </small>
                                </div>

                                <ArrowUpRight
                                  size={16}
                                />
                              </Link>
                            )
                          )}
                        </div>
                      )}

                      {searchResults.papers
                        .length > 0 && (
                        <div className="home-search-group">
                          <div className="home-search-group-title">
                            <FileText
                              size={16}
                            />
                            <span>
                              Question Papers
                            </span>
                          </div>

                          {searchResults.papers.map(
                            (paper) => (
                              <a
                                key={paper.id}
                                href={paper.pdf}
                                target="_blank"
                                rel="noreferrer"
                                className="home-search-result"
                              >
                                <div>
                                  <strong>
                                    {paper.subject ||
                                      paper.filename}
                                  </strong>

                                  <small>
                                    {paper.programme ||
                                      'Question Paper'}
                                    {paper.department
                                      ? ` • ${paper.department}`
                                      : ''}
                                    {paper.yearLabel
                                      ? ` • ${paper.yearLabel}`
                                      : ''}
                                  </small>
                                </div>

                                <ArrowUpRight
                                  size={16}
                                />
                              </a>
                            )
                          )}
                        </div>
                      )}

                      {searchResults
                        .publications
                        .length > 0 && (
                        <div className="home-search-group">
                          <div className="home-search-group-title">
                            <BookMarked
                              size={16}
                            />
                            <span>
                              Faculty Publications
                            </span>
                          </div>

                          {searchResults.publications.map(
                            (publication) => (
                              <Link
                                key={
                                  publication.id
                                }
                                to="/publications"
                                className="home-search-result"
                              >
                                <div>
                                  <strong>
                                    {
                                      publication.title
                                    }
                                  </strong>

                                  <small>
                                    by{' '}
                                    {publication.author ||
                                      'Faculty'}
                                    {publication.year
                                      ? ` • ${publication.year}`
                                      : ''}
                                  </small>
                                </div>

                                <ArrowUpRight
                                  size={16}
                                />
                              </Link>
                            )
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="hero-actions">
              <Link
                className="primary-btn"
                to="/catalogue"
              >
                Explore Library{' '}
                <ArrowRight size={17} />
              </Link>

              <Link
                className="ghost-btn"
                to="/question-papers"
              >
                Browse Question Papers
              </Link>
            </div>
          </div>

          <div className="hero-card hero-card-animate">
            <span className="eyebrow light">
              CENTRAL LIBRARY
            </span>

            <strong>
              {books.length > 0
                ? '23,438+'
                : '0'}
            </strong>

            <p>catalogue titles</p>

            <div className="hero-mini">
              <div>
                <b>10</b>
                <span>Departments</span>
              </div>

              <div>
                <b>8</b>
                <span>Semesters</span>
              </div>

              <div>
                <b>4</b>
                <span>Years</span>
              </div>
            </div>

            <span className="hero-location">
              <MapPin size={14} /> Vishnupuri,
              Nanded, Maharashtra
            </span>
          </div>
        </div>
      </section>

      <Reveal className="container stat-band-wrap">
        <section className="stat-band">
          <div>
            <b>10</b>
            <span>
              Academic Departments
            </span>
          </div>

          <div>
            <b>8</b>
            <span>Semesters</span>
          </div>

          <div>
            <b>4</b>
            <span>Academic Years</span>
          </div>

          <div>
            <b>B.Tech + M.Tech</b>
            <span>
              Question Paper Archive
            </span>
          </div>

          <div>
            <b>Faculty</b>
            <span>Publications</span>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="container section">
          <SectionTitle
            eyebrow="START HERE"
            title="Everything you need, in one place"
            text="A focused digital gateway for discovery, learning and institutional knowledge."
          />

          <div className="quick-grid stagger-grid">
            <QuickCard
              to="/catalogue"
              icon={BookOpen}
              title="Library Catalogue"
              text="Discover books and catalogue records."
            />

            <QuickCard
              to="/e-resources"
              icon={LibraryBig}
              title="E-Resources"
              text="Access digital learning and research resources."
            />

            <QuickCard
              to="/question-papers"
              icon={FileText}
              title="Question Papers"
              text="Browse B.Tech and M.Tech papers."
            />

            <QuickCard
              to="/departments"
              icon={Building2}
              title="Departments"
              text="Explore resources by department."
            />

            <QuickCard
              to="/publications"
              icon={BookMarked}
              title="Faculty Publications"
              text="Discover books and scholarly works published by institute faculty."
            />
          </div>
        </section>
      </Reveal>

      <section className="soft-section">
        <Reveal>
          <div className="container section">
            <SectionTitle
              eyebrow="ACADEMIC DIRECTORY"
              title="Explore by department"
              text="Jump directly into your department's academic resources."
              link={{
                to: '/departments',
                label:
                  'View all departments'
              }}
            />

            <div className="dept-grid stagger-grid">
              {departments
                .slice(0, 10)
                .map((department) => {
                  const Icon =
                    deptIcons[
                      department.slug
                    ] || Building2;

                  return (
                    <Link
                      className="dept-card"
                      to={`/departments/${department.slug}`}
                      key={department.slug}
                    >
                      <div className="dept-icon">
                        <Icon
                          size={22}
                          strokeWidth={1.7}
                        />
                      </div>

                      <span>
                        {department.short}
                      </span>

                      <h3>
                        {department.name}
                      </h3>

                      <p>
                        {
                          department.description
                        }
                      </p>

                      <ArrowUpRight />
                    </Link>
                  );
                })}
            </div>
          </div>
        </Reveal>
      </section>

      <Reveal>
        <section className="container section">
          <div className="video-section">
            <div className="video-copy">
              <span className="eyebrow">
                INSIDE THE LIBRARY
              </span>

              <h2>
                Discover the Central Library
                learning environment.
              </h2>

              <p>
                Take a closer look at the spaces
                where students read, learn,
                collaborate and access knowledge.
              </p>

              <Link
                className="text-link"
                to="/about"
              >
                About the library{' '}
                <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="video-wrap">
              <video
                controls
                poster={
                  site?.heroImage ||
                  '/images/library-hero.webp'
                }
                src={
                  site?.video ||
                  '/library-tour.mp4'
                }
              />

              <div className="video-label">
                <PlayCircle /> Library Tour
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="container section">
          <SectionTitle
            eyebrow="WHAT'S NEW"
            title="Latest from the library"
            text="Important updates, notices and academic resource announcements."
            link={{
              to: '/announcements',
              label: 'View all updates'
            }}
          />

          {announcements.length ? (
            <div className="news-grid stagger-grid">
              {announcements
                .slice(0, 3)
                .map((announcement) => (
                  <article
                    className="news-card"
                    key={announcement.id}
                  >
                    {announcement.image && (
                      <img
                        src={
                          announcement.image
                        }
                        alt=""
                      />
                    )}

                    <div className="news-body">
                      <div className="news-top">
                        <span className="chip">
                          {announcement.tag}
                        </span>

                        <small>
                          {announcement.date}
                        </small>
                      </div>

                      <h3>
                        {announcement.title}
                      </h3>

                      <p>
                        {announcement.text}
                      </p>

                      <Link to="/announcements">
                        Read update{' '}
                        <ArrowUpRight
                          size={15}
                        />
                      </Link>
                    </div>
                  </article>
                ))}
            </div>
          ) : (
            <Empty
              title="No announcements yet"
              text="New library updates will appear here."
            />
          )}
        </section>
      </Reveal>

      <Reveal>
        <section className="accent-section">
          <div className="container split-callout">
            <div>
              <span className="eyebrow">
                FACULTY PUBLICATIONS
              </span>

              <h2>
                Books and scholarly works
                published by institute faculty.
              </h2>

              <p>
                Explore a growing collection of
                institutional publications and
                faculty-authored books.
              </p>
            </div>

            <Link
              className="primary-btn"
              to="/publications"
            >
              Explore publications{' '}
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </Reveal>

      {/* =========================
          FACILITIES
          ========================= */}
      <Reveal>
        <section
          className="container section"
          style={{
            paddingTop: '0',
            paddingBottom: '56px',
          }}
        >
          <Link
            to="/facilities"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
              padding: '28px 32px',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              background: '#fff',
              textDecoration: 'none',
              color: 'inherit',
              boxShadow:
                '0 8px 24px rgba(18,38,63,.06)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                  borderRadius: '10px',
                  background: '#f1f5f9',
                  color: '#0056b3',
                }}
              >
                <Images size={25} />
              </div>

              <div>
                <span className="eyebrow">
                  LIBRARY SPACES
                </span>

                <h2
                  style={{
                    margin: '5px 0 5px',
                    fontSize: '1.35rem',
                  }}
                >
                  Explore Library Facilities
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: '#555',
                    fontSize: '0.92rem',
                  }}
                >
                  View photos and information about
                  the library's facilities and learning
                  spaces.
                </p>
              </div>
            </div>

            <ArrowUpRight
              size={24}
              style={{
                color: '#0056b3',
                flexShrink: 0,
              }}
            />
          </Link>
        </section>
      </Reveal>
    </div>
  );
}