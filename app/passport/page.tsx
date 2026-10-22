import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { db } from '@/lib/db';
import { Nav } from '@/components/Nav';
import { ProgressBar } from '@/components/ProgressBar';
import { overallCompletion } from '@/lib/passport';
import { DOCUMENT_TYPES, DOCUMENT_CATEGORY_INFO } from '@/lib/documentTypes';
import { MountEventTracker } from '@/components/pixel/PixelTrackers';
import { AutoSaveForm } from '@/components/AutoSaveForm';
import { PassportSteps } from '@/components/PassportSteps';
import { DocumentUpload } from '@/components/DocumentUpload';
import { maskSsn } from '@/lib/ssn';
import {
  updatePassportAction,
  markHouseholdNAAction,
  markPetsNAAction,
  markVehiclesNAAction,
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
  removeDocumentAction,
  savePersonalStatementAction,
  deletePersonalStatementAction
} from '@/lib/actions/passport';

// Documents shown up front; everything else sits under "More documents (optional)".
const PRIMARY_DOCUMENT_TYPES = ['Government ID', 'Pay Stub'];

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

  const renderDocCategory = (docType: string) => {
    const docsOfType = passport.documents.filter((d) => d.type === docType);
    const info = DOCUMENT_CATEGORY_INFO[docType] ?? { label: docType, description: '', button: 'Upload' };
    const uploaded = docsOfType.length > 0;
    return (
      <div key={docType} className={`doc-cat${uploaded ? ' doc-cat-done' : ''}`}>
        <div className="doc-cat-head">
          <strong className="doc-cat-title">{info.label}</strong>
          {uploaded && (
            <span className="doc-cat-badge doc-cat-badge-done">
              &#10003; Uploaded{docsOfType.length > 1 ? ` (${docsOfType.length})` : ''}
            </span>
          )}
        </div>
        {info.description && <p className="doc-cat-desc">{info.description}</p>}
        {uploaded && (
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
        <DocumentUpload action={uploadDocumentAction} docType={docType} buttonLabel={info.button} uploaded={uploaded} />
      </div>
    );
  };

  const moreDocTypes = DOCUMENT_TYPES.filter((t) => !PRIMARY_DOCUMENT_TYPES.includes(t));
  const moreHasDocs = passport.documents.some((d) => moreDocTypes.includes(d.type));

  // ---------------------------------------------------------------- Step 1
  const personalStep = (
    <AutoSaveForm action={updatePassportAction}>
      <div className="card" id="personal">
        <h2>Personal information</h2>
        <div className="grid-2">
          <div className="field">
            <label>First name</label>
            <input name="firstName" defaultValue={passport.firstName ?? ''} autoComplete="given-name" />
          </div>
          <div className="field">
            <label>Last name</label>
            <input name="lastName" defaultValue={passport.lastName ?? ''} autoComplete="family-name" />
          </div>
          <div className="field">
            <label>Date of birth</label>
            <input type="date" name="dateOfBirth" defaultValue={passport.dateOfBirth ?? ''} autoComplete="bday" />
          </div>
          <div className="field">
            <label>Phone</label>
            <input
              type="tel"
              name="mobilePhone"
              defaultValue={passport.mobilePhone ?? passport.homePhone ?? ''}
              autoComplete="tel"
            />
          </div>
          <div className="field">
            <label>Street address</label>
            <input name="streetAddress" defaultValue={passport.streetAddress ?? ''} autoComplete="address-line1" />
          </div>
          <div className="field">
            <label>City</label>
            <input name="city" defaultValue={passport.city ?? ''} autoComplete="address-level2" />
          </div>
          <div className="field">
            <label>State</label>
            <input name="state" defaultValue={passport.state ?? ''} autoComplete="address-level1" />
          </div>
          <div className="field">
            <label>Zip</label>
            <input
              name="zip"
              defaultValue={passport.zip ?? ''}
              inputMode="numeric"
              autoComplete="postal-code"
            />
          </div>
          <div className="field">
            <label>Annual income</label>
            <input name="annualIncome" defaultValue={passport.annualIncome ?? ''} inputMode="decimal" />
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label>Social Security number</label>
            <input
              name="ssn"
              placeholder={passport.ssn ? `${maskSsn(passport.ssn)} on file` : 'XXX-XX-XXXX'}
              inputMode="numeric"
              autoComplete="off"
            />
            <p className="muted" style={{ fontSize: 13, margin: '6px 0 0' }}>
              {passport.ssn
                ? 'Your SSN is saved and encrypted. Landlords only see the last 4 digits. Type a new one here to replace it.'
                : 'Needed to run your credit and background screening. You can fill in everything else first and add this when you’re ready.'}
            </p>
          </div>
        </div>
      </div>
    </AutoSaveForm>
  );

  // ---------------------------------------------------------------- Step 2
  const applicationStep = (
    <AutoSaveForm action={updatePassportAction}>
      <div className="card" id="application">
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
    </AutoSaveForm>
  );

  // ---------------------------------------------------------------- Step 3
  const householdStep = (
    <>
      {/* ---- Occupants ---- */}
      <div className="card" id="household">
        <h2>Household occupants</h2>
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
          <div className="table-scroll" style={{ marginBottom: 16 }}>
            <table>
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
          </div>
        )}
        <form action={addOccupantAction}>
          <div className="grid-2">
            <div className="field"><label>First name</label><input name="firstName" required /></div>
            <div className="field"><label>Last name</label><input name="lastName" required /></div>
            <div className="field"><label>Date of birth</label><input type="date" name="dateOfBirth" /></div>
            <div className="field"><label>Relationship</label><input name="relationship" /></div>
          </div>
          <button className="btn btn-primary" type="submit">Add occupant</button>
        </form>
      </div>

      {/* ---- Pets ---- */}
      <div className="card">
        <h2>Pets</h2>
        {passport.petsNA && (
          <p className="badge badge-approved" style={{ display: 'inline-block', marginBottom: 12 }}>
            Marked as N/A
          </p>
        )}
        {!passport.petsNA && passport.pets.length === 0 && (
          <form action={markPetsNAAction} style={{ marginBottom: 16 }}>
            <button className="btn btn-secondary btn-sm" type="submit">
              N/A &mdash; none of these apply
            </button>
          </form>
        )}
        {passport.pets.length > 0 && (
          <div className="table-scroll" style={{ marginBottom: 16 }}>
            <table>
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
          </div>
        )}
        <form action={addPetAction}>
          <div className="grid-2">
            <div className="field"><label>Type</label><input name="type" required /></div>
            <div className="field"><label>Breed</label><input name="breed" /></div>
            <div className="field"><label>Size (lbs)</label><input name="sizeLbs" inputMode="decimal" /></div>
            <div className="field"><label>Color</label><input name="color" /></div>
          </div>
          <button className="btn btn-primary" type="submit">Add pet</button>
        </form>
      </div>

      {/* ---- Vehicles ---- */}
      <div className="card">
        <h2>Vehicles</h2>
        {passport.vehiclesNA && (
          <p className="badge badge-approved" style={{ display: 'inline-block', marginBottom: 12 }}>
            Marked as N/A
          </p>
        )}
        {!passport.vehiclesNA && passport.vehicles.length === 0 && (
          <form action={markVehiclesNAAction} style={{ marginBottom: 16 }}>
            <button className="btn btn-secondary btn-sm" type="submit">
              N/A &mdash; none of these apply
            </button>
          </form>
        )}
        {passport.vehicles.length > 0 && (
          <div className="table-scroll" style={{ marginBottom: 16 }}>
            <table>
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
          </div>
        )}
        <form action={addVehicleAction}>
          <div className="grid-2">
            <div className="field"><label>Owner name</label><input name="ownerName" /></div>
            <div className="field"><label>Description (color etc.)</label><input name="description" required /></div>
            <div className="field"><label>License plate #</label><input name="licensePlate" autoComplete="off" /></div>
            <div className="field"><label>State</label><input name="state" autoComplete="off" /></div>
            <div className="field"><label>Make</label><input name="make" /></div>
            <div className="field"><label>Model</label><input name="model" /></div>
            <div className="field"><label>Year</label><input name="year" inputMode="numeric" /></div>
          </div>
          <button className="btn btn-primary" type="submit">Add vehicle</button>
        </form>
      </div>
    </>
  );

  // ---------------------------------------------------------------- Step 4
  const rentalStep = (
    <div className="card" id="rental-history">
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
          <div className="field"><label>Landlord</label><input name="landlord" autoComplete="off" /></div>
          <div className="field">
            <label>Landlord phone</label>
            <input name="landlordPhone" type="tel" autoComplete="off" />
          </div>
          <div className="field">
            <label>Landlord email</label>
            <input name="landlordEmail" type="email" autoComplete="off" />
          </div>
          <div className="field"><label>Street address</label><input name="street" autoComplete="off" /></div>
          <div className="field"><label>City</label><input name="city" autoComplete="off" /></div>
          <div className="field"><label>State</label><input name="state" autoComplete="off" /></div>
          <div className="field">
            <label>Zip</label>
            <input name="zip" inputMode="numeric" autoComplete="off" />
          </div>
          <div className="field"><label>Rent amount</label><input name="rentAmount" inputMode="decimal" /></div>
          <div className="field"><label>Reason for leaving</label><input name="reasonForLeaving" /></div>
        </div>
        <button className="btn btn-primary" type="submit">Add rental history entry</button>
      </form>
    </div>
  );

  // ---------------------------------------------------------------- Step 5
  const employmentStep = (
    <div className="card" id="employment">
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
          <div className="field"><label>Employer name</label><input name="employerName" required autoComplete="organization" /></div>
          <div className="field"><label>Position</label><input name="position" autoComplete="organization-title" /></div>
          <div className="field"><label>Supervisor</label><input name="supervisor" autoComplete="off" /></div>
          <div className="field">
            <label>Phone</label>
            <input name="phone" type="tel" autoComplete="off" />
          </div>
          <div className="field"><label>Address</label><input name="address" autoComplete="off" /></div>
          <div className="field"><label>Salary</label><input name="salary" inputMode="decimal" /></div>
        </div>
        <button className="btn btn-primary" type="submit">Add employment entry</button>
      </form>
    </div>
  );

  // ---------------------------------------------------------------- Step 6
  const referencesStep = (
    <div className="card" id="references">
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
        <div className="table-scroll" style={{ marginBottom: 16 }}>
          <table>
            <thead>
              <tr><th>Name</th><th>Relationship</th><th>Phone</th><th></th></tr>
            </thead>
            <tbody>
              {passport.references.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.relationship}</td>
                  <td>{r.mobilePhone || r.homePhone}</td>
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
        </div>
      )}
      <form action={addReferenceAction}>
        <div className="grid-2">
          <div className="field"><label>Name</label><input name="name" required autoComplete="off" /></div>
          <div className="field"><label>Relationship</label><input name="relationship" /></div>
          <div className="field">
            <label>Phone</label>
            <input name="phone" type="tel" autoComplete="off" />
          </div>
        </div>
        <button className="btn btn-primary" type="submit">Add reference</button>
      </form>
    </div>
  );

  // ---------------------------------------------------------------- Step 7
  const documentsStep = (
    <>
      <div className="card" id="documents">
        <h2>Documents</h2>
        <div className="docs-note" role="note">
          <span className="docs-note-icon" aria-hidden="true">i</span>
          <div>
            <p>Documents are optional, but ID and proof of income help landlords say yes faster.</p>
          </div>
        </div>
        {PRIMARY_DOCUMENT_TYPES.map(renderDocCategory)}
        <details className="docs-more" open={moreHasDocs}>
          <summary>More documents (optional)</summary>
          {moreDocTypes.map(renderDocCategory)}
        </details>
      </div>

      {/* ---- Personal Statement ---- */}
      <div className="card statement-card" id="personal-statement">
        <h2>Personal Statement (Optional)</h2>
        <p className="muted" style={{ fontSize: 14, marginTop: -6 }}>
          Would you like to share more about yourself or your current situation? Use this space to
          explain your circumstances, provide additional context, or share anything else you&apos;d
          like a landlord to understand about your rental application.
        </p>
        <form action={savePersonalStatementAction}>
          <div className="field">
            <textarea
              name="personalStatement"
              rows={6}
              maxLength={5000}
              defaultValue={passport.personalStatement ?? ''}
              placeholder="Tell us a little about yourself, your situation, or anything you'd like a landlord to understand about your application…"
            />
          </div>
          <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>
            This section is completely optional. You can use it to explain your circumstances, share
            relevant background information, or provide context that may not be reflected in the
            other sections of your application. Only include information you&apos;re comfortable
            sharing.
          </p>
          <div className="statement-actions">
            <button className="btn btn-primary" type="submit">Save Personal Statement</button>
          </div>
        </form>
        {passport.personalStatement && (
          <form action={deletePersonalStatementAction} style={{ marginTop: 10 }}>
            <button className="btn btn-danger btn-sm" type="submit">Delete statement</button>
          </form>
        )}
      </div>
    </>
  );

  return (
    <>
      <Nav email={user.email} role="TENANT" />
      {!passport.firstName && <MountEventTracker event="StartApplication" custom />}
      <div className="shell" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <h1>My Rental Passport</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <ProgressBar percent={percent} />
          </div>
          <span className="muted" style={{ fontSize: 14 }}>
            {percent}% complete
          </span>
        </div>

        <PassportSteps
          steps={[
            { id: 'personal', label: 'Personal info', content: personalStep },
            { id: 'application', label: 'This application', content: applicationStep },
            { id: 'household', label: 'Household', hashes: ['occupants', 'pets', 'vehicles'], content: householdStep },
            { id: 'rental-history', label: 'Rental history', hashes: ['rental'], content: rentalStep },
            { id: 'employment', label: 'Employment', content: employmentStep },
            { id: 'references', label: 'References', content: referencesStep },
            { id: 'documents', label: 'Documents', hashes: ['personal-statement'], content: documentsStep }
          ]}
        />
      </div>
    </>
  );
}
