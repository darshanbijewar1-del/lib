import React from 'react';
import { ImageOff } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { PageHero, SectionTitle } from '../../components/site';

export default function Facilities() {
  const { site } = useLibrary();

  const facilities = Array.isArray(site?.facilities)
    ? site.facilities
    : [];

  return (
    <>
      <PageHero
        eyebrow="LIBRARY FACILITIES"
        title="Facilities & Learning Spaces"
        text="Explore the facilities and learning spaces available at the SGGS Central Library."
        image="/images/library-building.webp"
      />

      <section className="container section">

        <SectionTitle
          eyebrow="OUR FACILITIES"
          title="Explore Our Library"
          text="Take a look at the facilities available to support reading, learning, research, and academic activities."
        />

        {facilities.length === 0 ? (
          <div
            className="contact-card"
            style={{
              textAlign: 'center',
              padding: '56px 24px',
              marginTop: '32px',
            }}
          >
            <ImageOff
              size={38}
              style={{
                color: '#0056b3',
                marginBottom: '14px',
              }}
            />

            <h3 style={{ margin: '0 0 8px' }}>
              Facilities coming soon
            </h3>

            <p
              style={{
                margin: 0,
                color: '#666',
                lineHeight: 1.6,
              }}
            >
              Library facility images will be displayed here
              once they are added by the administrator.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              marginTop: '32px',
            }}
          >
            {facilities.map((facility) => (
              <article
                key={facility.id}
                className="contact-card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '16 / 10',
                    overflow: 'hidden',
                    background: '#f1f5f9',
                  }}
                >
                  {facility.image ? (
                    <img
                      src={facility.image}
                      alt={facility.title || 'Library facility'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'grid',
                        placeItems: 'center',
                        color: '#64748b',
                      }}
                    >
                      <ImageOff size={34} />
                    </div>
                  )}
                </div>

                <div
                  style={{
                    padding: '22px 24px 24px',
                  }}
                >
                  <h3
                    style={{
                      margin: '0 0 8px',
                      fontSize: '1.2rem',
                    }}
                  >
                    {facility.title}
                  </h3>

                  {facility.description && (
                    <p
                      style={{
                        margin: 0,
                        color: '#555',
                        fontSize: '0.92rem',
                        lineHeight: 1.65,
                      }}
                    >
                      {facility.description}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

      </section>
    </>
  );
}