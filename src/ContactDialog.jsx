import React, {useEffect, useRef, useState} from 'react';

const emptyContact = {firstName:'', lastName:'', organization:'', email:'', phone:'', country:'', address1:'', address2:'', city:'', region:'', postalCode:''};
const fullName = contact => `${contact.firstName} ${contact.lastName}`;

export function ContactSummary({item, appliedCount, onEdit}) {
  return <div className="contact-setting">
    <div className="contact-summary-copy">
      <span className="contact-caption">Registrant contact</span>
      {item.contact ? <>
        <strong>{fullName(item.contact)}</strong>
        <span className="contact-detail">{item.contact.email}</span>
        {appliedCount > 1 && <small className="contact-scope">Applied to {appliedCount} site addresses in this order</small>}
      </> : <span className="contact-detail">Set the contact for this registration.</span>}
    </div>
    <button type="button" className="outline" aria-label={`${item.contact ? 'Edit' : 'Add'} registrant contact for ${item.name}`} onClick={onEdit}>{item.contact ? 'Edit' : 'Add contact'}</button>
  </div>;
}

export default function ContactDialog({item, itemCount, defaultApplyAll, onClose, onSave}) {
  const dialogRef = useRef(null);
  const [draft, setDraft] = useState(() => ({...emptyContact, ...item.contact}));
  const [applyAll, setApplyAll] = useState(defaultApplyAll);
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => { if (dialog.open) dialog.close(); };
  }, []);
  const field = (key, label, options={}) => <label className={options.full ? 'contact-field contact-field-full' : 'contact-field'}>
    <span>{label}{options.optional && <small>Optional</small>}</span>
    <input name={key} type={options.type || 'text'} required={!options.optional} pattern={options.optional ? undefined : '.*\\S.*'} autoComplete={options.autoComplete || 'off'} value={draft[key]} placeholder={options.placeholder || ''} maxLength={options.type==='email' ? 254 : 150} onChange={e=>setDraft({...draft, [key]:e.target.value})}/>
  </label>;
  return <dialog ref={dialogRef} className="contact-dialog" aria-labelledby="contact-dialog-title" aria-describedby="contact-dialog-description" onCancel={onClose} onClick={e=>{if(e.target===dialogRef.current)onClose();}}>
    <form onSubmit={e=>{e.preventDefault();onSave(Object.fromEntries(Object.entries(draft).map(([key,value])=>[key,value.trim()])),applyAll);}}>
      <div className="contact-dialog-header">
        <div><h2 id="contact-dialog-title">Registrant contact</h2><p id="contact-dialog-description">Contact details for {item.name}</p></div>
        <button type="button" className="icon-button contact-close" aria-label="Close registrant contact" onClick={onClose}>×</button>
      </div>
      <div className="contact-dialog-body">
        <div className="contact-fields">
          {field('firstName','First name',{autoComplete:'given-name'})}
          {field('lastName','Last name',{autoComplete:'family-name'})}
          {field('organization','Organization',{full:true,optional:true,autoComplete:'organization'})}
          {field('email','Email',{type:'email',autoComplete:'email',placeholder:'name@example.com'})}
          {field('phone','Phone',{type:'tel',autoComplete:'tel',placeholder:'+1 415 555 0100'})}
          <label className="contact-field contact-field-full"><span>Country / Region</span><select name="country" required autoComplete="country-name" value={draft.country} onChange={e=>setDraft({...draft,country:e.target.value})}>
            <option value="">Select country / region</option>{['United States','China','United Kingdom','Canada','Australia','Germany','Singapore','Japan','Other'].map(country=><option key={country}>{country}</option>)}
          </select></label>
          {field('address1','Street address',{full:true,autoComplete:'address-line1'})}
          {field('address2','Apartment, suite, etc.',{full:true,optional:true,autoComplete:'address-line2'})}
          {field('city','City',{autoComplete:'address-level2'})}
          {field('region','State / Province',{optional:true,autoComplete:'address-level1'})}
          {field('postalCode','ZIP / Postal code',{optional:true,autoComplete:'postal-code'})}
        </div>
      </div>
      <div className="contact-dialog-footer">
        <label className="contact-apply-all"><input type="checkbox" checked={applyAll} onChange={e=>setApplyAll(e.target.checked)}/><span>Apply to all site addresses in this order <b>({itemCount})</b><small>{applyAll ? 'Saves these details for every item in this order.' : `Only updates ${item.name}.`}</small></span></label>
        <div className="contact-dialog-actions"><button type="button" className="outline" onClick={onClose}>Cancel</button><button type="submit" className="primary">Save contact</button></div>
      </div>
    </form>
  </dialog>;
}
