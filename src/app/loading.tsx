export default function Loading() {
  return (
    <div
      style={{
        display: 'flex',
        margin: '0 auto',
        justifyContent: 'center',
        alignItems: 'center',
        width: '300px',
        height: '500px',
        background: 'transparent',
      }}
    >
      <div style={{ fontSize: '24px', color: '#fff' }}>
        Загрузка, пожалуйста подождите ...
      </div>
    </div>
  );
}
