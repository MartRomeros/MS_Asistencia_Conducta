- Genera la logica para registrar la asistencia de los alumnos.
- Si existe un registro con la misma fecha, se debe actualizar.
Este es el formato en que vendra:
```
{
  "cad_id": 1,
  "fecha": "2026-04-30",
  "asistencias": [
    {
      "estudiante_id": 104,
      "estado": "Tardanza",
      "tipo_asistencia": "Presencial"
    },
    {
      "estudiante_id": 102,
      "estado": "Presente",
      "tipo_asistencia": "Presencial"
    },
    {
      "estudiante_id": 100,
      "estado": "Justificado",
      "tipo_asistencia": "Presencial"
    },
    {
      "estudiante_id": 105,
      "estado": "Ausente",
      "tipo_asistencia": "Presencial"
    },
    {
      "estudiante_id": 103,
      "estado": "Presente",
      "tipo_asistencia": "Presencial"
    },
    {
      "estudiante_id": 101,
      "estado": "Presente",
      "tipo_asistencia": "Presencial"
    },
    {
      "estudiante_id": 108,
      "estado": "Presente",
      "tipo_asistencia": "Presencial"
    },
    {
      "estudiante_id": 109,
      "estado": "Presente",
      "tipo_asistencia": "Presencial"
    },
    {
      "estudiante_id": 107,
      "estado": "Presente",
      "tipo_asistencia": "Presencial"
    },
    {
      "estudiante_id": 106,
      "estado": "Presente",
      "tipo_asistencia": "Presencial"
    }
  ]
}
```