import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, Checkbox, ConfigProvider, Layout, Modal, Table, Tabs, Tag } from 'antd';
import { AppstoreOutlined, BellOutlined, CalendarOutlined, ClusterOutlined, DatabaseOutlined, HomeOutlined, MenuFoldOutlined, MinusOutlined, PlusOutlined, RocketOutlined, SettingOutlined, StarOutlined, ThunderboltOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import './styles.css';
import menuIcon from './assets/menu.svg';
import zetaIcon from './assets/zeta.svg';

const nav = [
  [<StarOutlined />, 'Athena'], [<AppstoreOutlined />, 'Applications'],
  [<RocketOutlined />, 'Onboarding'], [<HomeOutlined />, 'Home'],
  [<CalendarOutlined />, 'Calendar'], [<ThunderboltOutlined />, 'Opportunities'],
  [<RocketOutlined />, 'Campaigns'], [<ClusterOutlined />, 'Experiences'],
  [<AppstoreOutlined />, 'Conversations'], [<ClusterOutlined />, 'Audiences'],
  [<ThunderboltOutlined />, 'AI Studio'], [<AppstoreOutlined />, 'Content'],
  [<AppstoreOutlined />, 'Analytics'], [<DatabaseOutlined />, 'Data'],
  [<BellOutlined />, 'Notifications'], [<SettingOutlined />, 'Settings'],
];

// Geography selection drives both parent checkboxes and the current settings.
const stateNames = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
const zipKeys = ['zip-1', 'zip-2', 'zip-3'];
const stateKeys = stateNames.map(name => `state-${name}`);
const dmaKeys = ['dma-1', 'dma-2', 'dma-3'];
const groups = { zipcodes: zipKeys, states: stateKeys, dmas: dmaKeys };
const allKeys = [...zipKeys, ...stateKeys, ...dmaKeys];
const rows = [
  { key: 'parent', level: 0, name: 'Geographies', recommended: '-' },
  { key: 'zipcodes', level: 1, name: 'Zip Codes', recommended: '-' },
  ...zipKeys.map((key, i) => ({ key, group: 'zipcodes', level: 2, name: `Zip Code ${i + 1}`, recommended: 'Included' })),
  { key: 'states', level: 1, name: 'States', recommended: '-' },
  ...stateNames.map((name, i) => ({ key: stateKeys[i], group: 'states', level: 2, name, recommended: 'Included' })),
  { key: 'dmas', level: 1, name: 'Designated Market Area', recommended: '-' },
  ...dmaKeys.map((key, i) => ({ key, group: 'dmas', level: 2, name: `DMA ${i + 1}`, recommended: 'Included' })),
];

function RecommendationTable() {
  const [selected, setSelected] = useState([]);
  const [expanded, setExpanded] = useState({ parent: true, zipcodes: false, states: false, dmas: false });
  const allSelected = allKeys.every(key => selected.includes(key));
  function selectAll(checked) {
    setSelected(checked ? allKeys : []);
  }
  function selectGroup(group, checked) {
    setSelected(previous => checked ? [...new Set([...previous, ...groups[group]])] : previous.filter(key => !groups[group].includes(key)));
  }
  function selectGeography(key, checked) {
    setSelected(previous => checked ? [...new Set([...previous, key])] : previous.filter(item => item !== key));
  }
  function toggle(key) { setExpanded(previous => ({ ...previous, [key]: !previous[key] })); }
  const visibleRows = rows.filter(row => row.level === 0 || (expanded.parent && (row.level === 1 || expanded[row.group])));
  const columns = [
    { title: <Checkbox checked={allSelected} indeterminate={selected.length > 0 && !allSelected} onChange={event => selectAll(event.target.checked)} aria-label="Select all rows" />, key: 'selection', width: 56, render: (_, row) => {
      const checked = row.key === 'parent' ? allSelected : row.level === 1 ? groups[row.key].every(key => selected.includes(key)) : selected.includes(row.key);
      const indeterminate = row.key === 'parent' ? selected.length > 0 && !allSelected : row.level === 1 && !checked && groups[row.key].some(key => selected.includes(key));
      return <Checkbox checked={checked} indeterminate={indeterminate} onChange={event => row.key === 'parent' ? selectAll(event.target.checked) : row.level === 1 ? selectGroup(row.key, event.target.checked) : selectGeography(row.key, event.target.checked)} aria-label={`Select ${row.name}`} />;
    } },
    { title: 'Name', dataIndex: 'name', key: 'name', ellipsis: true, render: (name, row) => {
      const control = row.level < 2 && <button type="button" className="tree-toggle" aria-label={`${expanded[row.key] ? 'Collapse' : 'Expand'} ${name}`} aria-expanded={expanded[row.key]} onClick={() => toggle(row.key)}>{expanded[row.key] ? <MinusOutlined /> : <PlusOutlined />}</button>;
      return <div className={`name-cell level-${row.level}`}><span className="tree-slots"><span className="tree-slot">{row.level === 0 && control}</span><span className="tree-slot">{row.level === 1 && control}</span></span><strong title={name}>{name}</strong></div>;
    } },
    { title: 'Current Setting', key: 'current', width: 160, render: (_, row) => row.level < 2 ? '-' : <Tag className="setting-tag" color={selected.includes(row.key) ? 'green' : 'gold'}>{selected.includes(row.key) ? 'Included' : 'Excluded'}</Tag> },
    { title: 'Recommended Setting', dataIndex: 'recommended', key: 'recommended', width: 190, render: value => value === '-' ? value : <Tag className="setting-tag" color="green">{value}</Tag> },
  ];
  return <Table columns={columns} dataSource={visibleRows} pagination={false} tableLayout="fixed" className="recommendation-table" />;
}

function AppShell() {
  return <Layout className="app-shell">
    <Layout.Sider width={240} className="sidebar"><div className="brand"><span className="brand-lockup"><img src={zetaIcon} alt="" /> ZETA</span><MenuFoldOutlined /></div><nav aria-label="Main navigation">{nav.map(([icon, label], i) => <div key={label} className={`nav-item ${label === 'Home' ? 'selected' : ''} ${i === 2 ? 'nav-divider' : ''}`}><span className="nav-icon">{icon}</span>{label}{['Campaigns','Experiences','Audiences','AI Studio','Content','Analytics','Data'].includes(label) && <span className="chevron">⌃</span>}</div>)}</nav><div className="account"><span className="account-avatar"><img src={zetaIcon} alt="" /></span><span><b>Zeta Luxury Hotels</b><small>Tokyo, Ginza Luxury To...</small></span></div></Layout.Sider>
    <Layout className="main-layout"><header className="topbar">Performance Advisor</header><div className="shell-tabs"><span>Home</span><span className="active">Performance Advisor</span></div><main className="canvas" /></Layout>
  </Layout>;
}
function App() {
 return <ConfigProvider theme={{ token: { colorPrimary: '#1677ff', fontFamily: 'Lato, Arial, sans-serif', borderRadius: 8, fontSize: 14 } }}><AppShell/><Modal open centered width={1024} title="Location Recommendation" footer={<div className="modal-footer"><Button type="link">Similar Recommendations</Button><div className="split-button"><Button type="primary">Manage</Button><Button type="primary" aria-label="More manage options" icon={<img src={menuIcon} alt="" />} /></div></div>} className="recommendation-modal" maskClosable={false} keyboard={false}>
    <Tabs activeKey="change" items={[{key:'expect',label:'What to Expect'},{key:'change',label:'What to Change'},{key:'works',label:'Why It Works'},{key:'test',label:'How to Test'}]} />
    <p className="instructions">Please select one, multiple, or all of the following campaigns modifications. Use the Manage menu to <strong>Activate</strong> the recommendation and apply the modifications now, <strong>Add to Planning</strong> to save for future consideration, or access <strong>Athena Guidance</strong> for step-by-step support.</p>
    <RecommendationTable />
  </Modal></ConfigProvider>;
}

createRoot(document.getElementById('root')).render(<App/>);
