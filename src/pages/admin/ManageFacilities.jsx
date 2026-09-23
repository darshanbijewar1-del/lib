import React, { useEffect, useState } from 'react'
import { ImagePlus, Pencil, Trash2, X } from 'lucide-react'
import { useLibrary } from '../../context/LibraryContext'
import {
  AdminPage,
  Field,
  ManagerForm,
  MediaPicker,
} from '../../components/admin'

const emptyForm = {
  title: '',
  description: '',
  image: '',
}

const createId = () =>
  `facility-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const getFacilities = site =>
  Array.isArray(site?.facilities) ? site.facilities : []

export default function ManageFacilities() {
  const {
    site,
    setSite,
    saveContent,
    uploadMedia,
    setToast,
  } = useLibrary()

  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const facilities = getFacilities(site)

  useEffect(() => {
    if (!editingId) {
      setForm(emptyForm)
    }
  }, [site, editingId])

  const update = (field, value) => {
    setForm(current => ({
      ...current,
      [field]: value,
    }))
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  /*
   * Use the project's existing uploadMedia() implementation.
   * This is the same upload flow already used by HomepageEditor.
   */
  const handleImageChange = async fileOrValue => {
    if (typeof fileOrValue === 'string') {
      update('image', fileOrValue)
      return
    }

    if (!fileOrValue) {
      return
    }

    setUploading(true)

    try {
      const result = await uploadMedia(fileOrValue)

      if (!result?.url) {
        throw new Error(
          'Upload completed but no media URL was returned.'
        )
      }

      update('image', result.url)
      setToast('Facility image uploaded successfully')
    } catch (error) {
      console.error('FACILITY_IMAGE_UPLOAD_ERROR', error)

      setToast(
        error?.message ||
          'Facility image upload failed. Please try again.'
      )
    } finally {
      setUploading(false)
    }
  }

  const saveFacility = async event => {
    event.preventDefault()

    if (!form.title.trim()) {
      setToast('Please enter a facility name')
      return
    }

    if (!form.image.trim()) {
      setToast('Please upload a facility image')
      return
    }

    setSaving(true)

    const facility = {
      id: editingId || createId(),
      title: form.title.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
    }

    const nextFacilities = editingId
      ? facilities.map(item =>
          item.id === editingId ? facility : item
        )
      : [...facilities, facility]

    const nextSite = {
      ...(site || {}),
      facilities: nextFacilities,
    }

    try {
      setSite(nextSite)

      await saveContent({
        site: nextSite,
      })

      setToast(
        editingId
          ? 'Facility updated successfully'
          : 'Facility added successfully'
      )

      resetForm()
    } catch (error) {
      console.error('FACILITY_SAVE_ERROR', error)

      setSite(site)

      setToast('Unable to save facility')
    } finally {
      setSaving(false)
    }
  }

  const startEdit = facility => {
    setEditingId(facility.id)

    setForm({
      title: facility.title || '',
      description: facility.description || '',
      image: facility.image || '',
    })

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const removeFacility = async id => {
    const facility = facilities.find(item => item.id === id)

    if (!facility) return

    const confirmed = window.confirm(
      `Delete "${facility.title}" from the facilities gallery?`
    )

    if (!confirmed) return

    setSaving(true)

    const nextFacilities = facilities.filter(
      item => item.id !== id
    )

    const nextSite = {
      ...(site || {}),
      facilities: nextFacilities,
    }

    try {
      setSite(nextSite)

      await saveContent({
        site: nextSite,
      })

      if (editingId === id) {
        resetForm()
      }

      setToast('Facility removed successfully')
    } catch (error) {
      console.error('FACILITY_DELETE_ERROR', error)

      setSite(site)

      setToast('Unable to remove facility')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminPage
      eyebrow="FACILITIES"
      title="Manage facilities"
      description="Add and manage the library facilities that will appear on the public Facilities page."
    >
      <ManagerForm
        title={
          editingId
            ? 'Edit facility'
            : 'Add facility'
        }
        onSubmit={saveFacility}
      >
        <div className="form-section-heading">
          <span>01</span>

          <div>
            <h3>Facility information</h3>

            <p>
              Add the facility name and a short description
              for visitors.
            </p>
          </div>
        </div>

        <Field
          label="Facility name"
          required
        >
          <input
            required
            value={form.title}
            onChange={event =>
              update(
                'title',
                event.target.value
              )
            }
            placeholder="e.g. Reading Hall"
          />
        </Field>

        <Field label="Description">
          <textarea
            rows="4"
            value={form.description}
            onChange={event =>
              update(
                'description',
                event.target.value
              )
            }
            placeholder="Briefly describe this facility..."
          />
        </Field>

        <div className="form-section-heading">
          <span>02</span>

          <div>
            <h3>Facility image</h3>

            <p>
              Upload the image that will be displayed
              in the facilities gallery.
            </p>
          </div>
        </div>

        <MediaPicker
          label="Facility image"
          value={form.image}
          onChange={handleImageChange}
          accept="image/png,image/jpeg,image/webp,image/avif"
          type="image"
          hint="Use a clear library facility photograph."
        />

        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginTop: '8px',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="submit"
            className="primary-btn"
            disabled={saving || uploading}
          >
            <ImagePlus size={16} />

            {uploading
              ? 'Uploading...'
              : saving
                ? 'Saving...'
                : editingId
                  ? 'Update Facility'
                  : 'Add Facility'}
          </button>

          {editingId && (
            <button
              type="button"
              className="ghost-btn"
              onClick={resetForm}
              disabled={saving || uploading}
            >
              <X size={16} />
              Cancel Edit
            </button>
          )}
        </div>
      </ManagerForm>

      <section
        style={{
          marginTop: '34px',
        }}
      >
        <div
          className="form-section-heading"
          style={{
            marginBottom: '20px',
          }}
        >
          <span>03</span>

          <div>
            <h3>Added facilities</h3>

            <p>
              Facilities currently available on the
              public gallery.
            </p>
          </div>
        </div>

        {facilities.length === 0 ? (
          <div
            style={{
              padding: '34px 24px',
              border: '1px dashed #cbd5e1',
              borderRadius: '12px',
              textAlign: 'center',
              background: '#f8fafc',
            }}
          >
            <ImagePlus
              size={30}
              style={{
                marginBottom: '10px',
              }}
            />

            <h3
              style={{
                margin: '0 0 6px',
              }}
            >
              No facilities added yet
            </h3>

            <p
              style={{
                margin: 0,
                color: '#64748b',
              }}
            >
              Add the first library facility using
              the form above.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '18px',
            }}
          >
            {facilities.map(facility => (
              <article
                key={facility.id}
                style={{
                  overflow: 'hidden',
                  border: '1px solid #dbe4ee',
                  borderRadius: '14px',
                  background: '#fff',
                  boxShadow:
                    '0 8px 24px rgba(18,38,63,.07)',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '16 / 10',
                    background: '#eef3f7',
                    overflow: 'hidden',
                  }}
                >
                  {facility.image ? (
                    <img
                      src={facility.image}
                      alt={facility.title}
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
                      }}
                    >
                      <ImagePlus size={30} />
                    </div>
                  )}
                </div>

                <div
                  style={{
                    padding: '18px',
                  }}
                >
                  <h3
                    style={{
                      margin: '0 0 7px',
                      fontSize: '18px',
                    }}
                  >
                    {facility.title}
                  </h3>

                  {facility.description && (
                    <p
                      style={{
                        margin: '0 0 16px',
                        color: '#64748b',
                        lineHeight: 1.6,
                        fontSize: '14px',
                      }}
                    >
                      {facility.description}
                    </p>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <button
                      type="button"
                      className="outline-btn"
                      onClick={() =>
                        startEdit(facility)
                      }
                      disabled={saving || uploading}
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      type="button"
                      className="ghost-btn"
                      onClick={() =>
                        removeFacility(
                          facility.id
                        )
                      }
                      disabled={saving || uploading}
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </AdminPage>
  )
}