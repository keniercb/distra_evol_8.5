<?php

class DatEstructuraNotificacionesModel extends DatDestinatarioModel
{
    public function DatEstructuraNotificacionesModel()
    {
        parent::DatDestinatarioModel();
        $this->type = 'Estructura';
    }

    public function insertar_datestructuranotificaciones(
        DatEstructuraNotificaciones $datEstructura
    )
    {
        $datEstructura->iddestinatario = parent::insertardat_destinatario();
        $datEstructura->save();
    }

    public function modificar_datestructuranotificaciones(
        DatEstructuraNotificaciones $datEstructura
    )
    {
        $datEstructura->save();
    }

    public function eliminar_datestructuranotificaciones(
        DatEstructuraNotificaciones $datEstructura
    )
    {
        $datEstructura->delete();
    }

    public function getConcretDestinatarios($iddest)
    {
        return array($this->type => Doctrine:: getTable(
            'DatEstructuraNotificaciones'
        )->find($iddest)->idestructura);
    }

    public function getFullName($iddest)
    {
        $idestructura = Doctrine:: getTable('DatEstructuraNotificaciones')
            ->find($iddest)->idestructura;

        //@TODO
        return $idestructura;
    }

} 