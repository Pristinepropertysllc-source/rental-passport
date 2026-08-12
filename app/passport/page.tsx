import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { db } from '@/lib/db';
import { Nav } from '@/components/Nav';
import { ProgressBar } from '@/components/ProgressBar';
import { overallCompletion } from '@/lib/passport';
import { DOCUMENT_TYPES } from '@/lib/documentTypes';
import {
  updatePassportAction,
  markHouseholdNAAction,
  markEmploymentNAAction,
  markRentalHistoryNAAction,
  markReferencesNAAction,
  addOccupantAction,
  removeOccupantAction,
  addPetAction,
  removePetAction,
  addVehicleAction,
  removeVehicleAction,
  addRentalHistoryAction,
  removeRentalHistoryAction,
  addEmploymentAction,
  removeEmploymentAction,
  addReferenceAction,
  removeReferenceAction,
  uploadDocumentAction,
  removeDocumentAction
} from '@/lib/actions/passport';

export default async function PassportPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'TENANT') redirect('/landlord/dashboard');

  const passport = await db.passport.findUnique({
    where: { userId: user.id },
    include: {
      references: true,
      documents: true,
      occupants: true,
      pets: true,
      vehicles: true,
      rentalHistory: true,
      employment: true
    }
  });
  if (!passport) redirect('/dashboard');

  const percent = overallCompletion(passport);

  return (
    <>
      <Nav email={user.email} role="TENANT" />
      <div className="shell" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <h1>My Rental Passport</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <div style={{ flex: 1 }}>
            <ProgressBar percent={percent} />
          </div>
          <span className="muted" style={{ fontSize: 14 }}>
            {percent}% complete
          </span>
        </div>

        <form action={updatePassportAction}>
          <div className="card">
            <h2>Personal information</h2>
            <div className="grid-2">
              <div className="field">
                <label>First name</label>
                <input name="firstName" defaultValue={passport.firstName ?? ''} />
              </div>
              <div className="field">
                <label>Last name</label>
                <input name="lastName" defaultValue={passport.lastName ?? ''} />
              </div>
              <div className="field">
                <label>Date of birth</label>
                <input type="date" name="dateOfBirth" defaultValue={passport.dateOfBirth ?? ''} />
              </div>
              <div className="field">
                <label>SSN</label>
                <input name="ssn" defaultValue={passport.ssn ?? ''} placeholder="XXX-XX-XXXX" />
              </div>
              <div className="field">
                <label>Street address</label>
                <input name="streetAddress" defaultValue={passport.streetAddress ?? ''} />
              </div>
              <div className="field">
                <label>City</label>
                <input name="city" defaultValue={passport.city ?? ''} />
              </div>
              <div className="field">
                <label>State</label>
                <input name="state" defaultValue={passport.state ?? ''} />
              </div>
              <div className="field">
                <label>Zip</label>
                <input name="zip" defaultValue={passport.zip ?? ''} />
              </div>
              <div className="field">
                <label>Home phone</label>
                <input name="homePhone" defaultValue={passport.homePhone ?? ''} />
              </div>
              <div className="field">
                <label>Mobile phone</label>
                <input name="mobilePhone" defaultValue={passport.mobilePhone ?? ''} />
              </div>
              <div className="field">
                <label>Annual income</label>
                <input name="annualIncome" defaultValue={passport.annualIncome ?? ''} />
              </div>
            </div>
          </div>

          <div className="card">
            <h2>This application</h2>
            <div className="grid-2">
              <div className="field">
                <label>Which property are you applying to?</label>
                <input name="propertyApplyingTo" defaultValue={passport.propertyApplyingTo ?? ''} />
              </div>
              <div className="field">
                <label>When do you want to move in?</label>
                <input type="date" name="moveInDate" defaultValue={passport.moveInDate ?? ''} />
              </div>
              <div className="field">
                <label>Are you active military?</label>
                <select name="activeMilitary" defaultValue={passport.activeMilitary ?? ''}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="field">
                <label>Do you have past judgments or lawsuits?</label>
                <select name="pastJudgments" defaultValue={passport.pastJudgments ?? ''}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="field">
                <label>Have you been arrested or convicted for a crime?</label>
                <select name="arrestedConvicted" defaultValue={passport.arrestedConvicted ?? ''}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>

          <button className="btn btn-primary" type="submit">
            Save
          </button>
        </form>

        {/* ---- Occupants ---- */}
        <div className="card">
          <h2>Household occupants, pets &amp; vehicles</h2>
          {passport.householdNA && (
            <p className="badge badge-approved" style={{ display: 'inline-block', marginBottom: 12 }}>
              Marked as N/A
            </p>
          )}
          {!passport.householdNA &&
            passport.occupants.length === 0 &&
            passport.pets.length === 0 &&
            passport.vehicles.length === 0 && (
              <form action={markHouseholdNAAction} style={{ marginBottom: 16 }}>
                <button className="btn btn-secondary btn-sm" type="submit">
                  N/A &mdash; none of these apply
                </button>
              </form>
            )}
          {passport.occupants.length > 0 && (
            <table style={{ marginBottom: 16 }}>
              <thead>
                <tr><th>Name</th><th>Date of birth</th><th>Relationship</th><th></th></tr>
              </thead>
              <tbody>
                {passport.occupants.map((o) => (
                  <tr key={o.id}>
                    <td>{o.firstName} {o.lastName}</td>
                    <td>{o.dateOfBirth}</td>
                    <td>{o.relationship}</td>
                    <td>
                      <form action={removeOccupantAction}>
                        <input type="hidden" name="id" value={o.id} />
                        <button className="btn btn-danger btn-sm" type="submit">Remove</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <form action={addOccupantAction}>
            <div className="grid-2">
              <div className="field"><label>First name</label><input name="firstName" required /></div>
              <div className="field"><label>Last name</label><input name="lastName" required /></div>
              <div className="field"><label>Date of birth</label><input type="date" name="dateOfBirth" /></div>
              <div className="field"><label>Relationship</label><input name="relationship" /></div>
            </div>
            <button className="btn btn-secondary" type="submit">Add occupant</button>
          </form>
        </div>

        {/* ---- Pets ---- */}
        <div className="card">
          <h2>Pets</h2>
          {passport.pets.length > 0 && (
            <table style={{ marginBottom: 16 }}>
              <thead>
                <tr><th>Type</th><th>Breed</th><th>Size (lbs)</th><th>Color</th><th></th></tr>
              </thead>
              <tbody>
                {passport.pets.map((p) => (
                  <tr key={p.id}>
                    <td>{p.type}</td>
                    <td>{p.breed}</td>
                    <td>{p.sizeLbs}</td>
                    <td>{p.color}</td>
                    <td>
                      <form action={removePetAction}>
                        <input type="hidden" name="id" value={p.id} />
                        <button className="btn btn-danger btn-sm" type="submit">Remove</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <form action={addPetAction}>
            <div className="grid-2">
              <div className="field"><label>Type</label><input name="type" required /></div>
              <div className="field"><label>Breed</label><input name="breed" /></div>
              <div className="field"><label>Size (lbs)</label><input name="sizeLbs" /></div>
              <div className="field"><label>Color</label><input name="color" /></div>
            </div>
            <button className="btn btn-secondary" type="submit">Add pet</button>
          </form>
        </div>

        {/* ---- Vehicles ---- */}
        <div className="card">
          <h2>Vehicles</h2>
          {passport.vehicles.length > 0 && (
            <table style={{ marginBottom: 16 }}>
              <thead>
                <tr><th>Owner</th><th>Description</th><th>Plate</th><th>State</th><th>Make/Model/Year</th><th></th></tr>
              </thead>
              <tbody>
                {passport.vehicles.map((v) => (
                  <tr key={v.id}>
                    <td>{v.ownerName}</td>
                    <td>{v.description}</td>
                    <td>{v.licensePlate}</td>
                    <td>{v.state}</td>
                    <td>{[v.make, v.model, v.year].filter(Boolean).join(' / ')}</td>
                    <td>
                      <form action={removeVehicleAction}>
                        <input type="hidden" name="id" value={v.id} />
                        <button className="btn btn-danger btn-sm" type="submit">Remove</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <form action={addVehicleAction}>
            <div className="grid-2">
              <div className="field"><label>Owner name</label><input name="ownerName" /></div>
              <div className="field"><label>Owner address</label><input name="ownerAddress" /></div>
              <div className="field"><label>Owner home phone</label><input name="ownerHomePhone" /></div>
              <div className="field"><label>Description (color etc.)</label><input name="description" required /></div>
              <div className="field"><label>License plate #</label><input name="licensePlate" /></div>
              <div className="field"><label>State</label><input name="state" /></div>
              <div className="field"><label>Make</label><input name="make" /></div>
              <div className="field"><label>Model</label><input name="model" /></div>
              <div className="field"><label>Year</label><input name="year" /></div>
            </div>
            <button className="btn btn-secondary" type="submit">Add vehicle</button>
          </form>
        </div>

        {/* ---- Rental history ---- */}
        <div className="card">
          <h2>Rental history</h2>
          {passport.rentalHistoryNA && (
            <p className="badge badge-approved" style={{ display: 'inline-block', marginBottom: 12 }}>
              Marked as N/A
            </p>
          )}
          {!passport.rentalHistoryNA && passport.rentalHistory.length === 0 && (
            <form action={markRentalHistoryNAAction} style={{ marginBottom: 16 }}>
              <button className="btn btn-secondary btn-sm" type="submit">
                N/A &mdash; no rental history
              </button>
            </form>
          )}
          {passport.rentalHistory.length > 0 && (
            <div className="section-list" style={{ marginBottom: 16 }}>
              {passport.rentalHistory.map((r) => (
                <div className="section-row" key={r.id} style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
                  <strong>{r.street}, {r.city}, {r.state} {r.zip}</strong>
                  <span className="muted" style={{ fontSize: 13 }}>
                    {r.moveIn} &ndash; {r.moveOut} &middot; ${r.rentAmount}/mo &middot; Landlord: {r.landlord} ({r.landlordPhone})
                  </span>
                  <span className="muted" style={{ fontSize: 13 }}>Reason for leaving: {r.reasonForLeaving}</span>
                  <form action={removeRentalHistoryAction}>
                    <input type="hidden" name="id" value={r.id} />
                    <button className="btn btn-danger btn-sm" type="submit">Remove</button>
                  </form>
                </div>
              ))}
            </div>
          )}
          <form action={addRentalHistoryAction}>
            <div className="grid-2">
              <div className="field"><label>Move in</label><input type="date" name="moveIn" /></div>
              <div className="field"><label>Move out</label><input type="date" name="moveOut" /></div>
              <div className="field"><label>Landlord</label><input name="landlord" /></div>
              <div className="field"><label>Landlord phone</label><input name="landlordPhone" /></div>
              <div className="field"><label>Landlord email</label><input name="landlordEmail" type="email" /></div>
              <div className="field"><label>Street address</label><input name="street" /></div>
              <div className="field"><label>City</label><input name="city" /></div>
              <div className="field"><label>State</label><input name="state" /></div>
              <div className="field"><label>Zip</label><input name="zip" /></div>
              <div className="field"><label>Rent amount</label><input name="rentAmount" /></div>
              <div className="field"><label>Reason for leaving</label><input name="reasonForLeaving" /></div>
            </div>
            <button className="btn btn-secondary" type="submit">Add rental history entry</button>
          </form>
        </div>

        {/* ---- Employment history ---- */}
        <div className="card">
          <h2>Employment history</h2>
          {passport.employmentNA && (
            <p className="badge badge-approved" style={{ display: 'inline-block', marginBottom: 12 }}>
              Marked as N/A
            </p>
          )}
          {!passport.employmentNA && passport.employment.length === 0 && (
            <form action={markEmploymentNAAction} style={{ marginBottom: 16 }}>
              <button className="btn btn-secondary btn-sm" type="submit">
                N/A &mdash; not currently employed
              </button>
            </form>
          )}
          {passport.employment.length > 0 && (
            <div className="section-list" style={{ marginBottom: 16 }}>
              {passport.employment.map((e) => (
                <div className="section-row" key={e.id} style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
                  <strong>{e.employerName} &mdash; {e.position}</strong>
                  <span className="muted" style={{ fontSize: 13 }}>
                    {e.dateStart} &ndash; {e.dateEnd || 'Present'} &middot; Supervisor: {e.supervisor} &middot; {e.phone}
                  </span>
                  <span className="muted" style={{ fontSize: 13 }}>{e.address} &middot; Salary: ${e.salary}</span>
                  <form action={removeEmploymentAction}>
                    <input type="hidden" name="id" value={e.id} />
                    <button className="btn btn-danger btn-sm" type="submit">Remove</button>
                  </form>
                </div>
              ))}
            </div>
          )}
          <form action={addEmploymentAction}>
            <div className="grid-2">
              <div className="field"><label>Date start</label><input type="date" name="dateStart" /></div>
              <div className="field"><label>Date end</label><input type="date" name="dateEnd" /></div>
              <div className="field"><label>Employer name</label><input name="employerName" required /></div>
              <div className="field"><label>Position</label><input name="position" /></div>
              <div className="field"><label>Supervisor</label><input name="supervisor" /></div>
              <div className="field"><label>Phone</label><input name="phone" /></div>
              <div className="field"><label>Address</label><input name="address" /></div>
              <div className="field"><label>Salary</label><input name="salary" /></div>
            </div>
            <button className="btn btn-secondary" type="submit">Add employment entry</button>
          </form>
        </div>

        {/* ---- References ---- */}
        <div className="card">
          <h2>References</h2>
          {passport.referencesNA && (
            <p className="badge badge-approved" style={{ display: 'inline-block', marginBottom: 12 }}>
              Marked as N/A
            </p>
          )}
          {!passport.referencesNA && passport.references.length === 0 && (
            <form action={markReferencesNAAction} style={{ marginBottom: 16 }}>
              <button className="btn btn-secondary btn-sm" type="submit">
                N/A &mdash; no references to provide
              </button>
            </form>
          )}
          {passport.references.length > 0 && (
            <table style={{ marginBottom: 16 }}>
              <thead>
                <tr><th>Name</th><th>Relationship</th><th>Home phone</th><th>Mobile phone</th><th></th></tr>
              </thead>
              <tbody>
                {passport.references.map((r) => (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td>{r.relationship}</td>
                    <td>{r.homePhone}</td>
                    <td>{r.mobilePhone}</td>
                    <td>
                      <form action={removeReferenceAction}>
                        <input type="hidden" name="id" value={r.id} />
                        <button className="btn btn-danger btn-sm" type="submit">Remove</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <form action={addReferenceAction}>
            <div className="grid-2">
              <div className="field"><label>Name</label><input name="name" required /></div>
              <div className="field"><label>Relationship</label><input name="relationship" /></div>
              <div className="field"><label>Address</label><input name="address" /></div>
              <div className="field"><label>Home phone</label><input name="homePhone" /></div>
              <div className="field"><label>Mobile phone</label><input name="mobilePhone" /></div>
            </div>
            <button className="btn btn-secondary" type="submit">Add reference</button>
          </form>
        </div>

        {/* ---- Documents ---- */}
        <div className="card">
          <h2>Documents</h2>
          <p className="muted" style={{ fontSize: 13, marginTop: -6 }}>
            Upload each document under its own category. You can upload more than one file per
            category if needed.
          </p>
          {DOCUMENT_TYPES.map((docType) => {
            const docsOfType = passport.documents.filter((d) => d.type === docType);
            return (
              <div key={docType} style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <strong style={{ fontSize: 14 }}>{docType}</strong>
                {docsOfType.length > 0 && (
                  <div className="doc-list" style={{ marginTop: 8, marginBottom: 10 }}>
                    {docsOfType.map((doc) => (
                      <div className="doc-row" key={doc.id}>
                        <span>{doc.filename}</span>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <a href={`/api/doc/${doc.id}`} target="_blank" rel="noreferrer">View</a>
                          <form action={removeDocumentAction}>
                            <input type="hidden" name="id" value={doc.id} />
                            <button className="btn btn-danger btn-sm" type="submit">Remove</button>
                          </form>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <form action={uploadDocumentAction} style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 8 }}>
                  <input type="hidden" name="type" value={docType} />
                  <input name="file" type="file" required />
                  <button className="btn btn-secondary btn-sm" type="submit">Upload</button>
                </form>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
