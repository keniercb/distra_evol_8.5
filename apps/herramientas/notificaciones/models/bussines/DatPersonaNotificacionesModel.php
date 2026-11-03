<?php

class DatPersonaNotificacionesModel extends DatDestinatarioModel
{
    public function DatPersonaNotificacionesModel()
    {
        parent::DatDestinatarioModel();
        $this->type = 'Persona';
    }

    public function insertar_datpersonanotificaciones(
        DatPersonaNotificaciones $datPersona
    )
    {
        if (!$datPersona->existe()) {
            $datPersona->iddestinatario = parent::insertardat_destinatario();
            $datPersona->save();

            return true;
        }

        return false;
    }

    public function modificar_datpersonanotificaciones(
        DatPersonaNotificaciones $datPersona
    )
    {
        $datPersona->save();
    }

    public function eliminar_datpersonanotificaciones(
        DatPersonaNotificaciones $datPersona
    )
    {
        $datPersona->delete();
    }

    public function getConcretDestinatarios($iddest)
    {
        return array($this->type => Doctrine:: getTable(
            'DatPersonaNotificaciones'
        )->find($iddest)->idpersona);
    }

    public function getFullName($iddest, $idpersona = null)
    {
        $person = ($idpersona == null) ? $this->getConcretDestinatarios($iddest)
            : array($idpersona);

        return NotificacionesUtil:: fullName(
            end(
                $this->integrator->pvd->BuscarPersonaPorArreglodeID(
                    array_values($person)
                )
            )
        );
    }

    public function getUIBuscarPersona()
    {
        return $this->integrator->pvd->mostrarIUBuscarPersona();
    }

    public static function getByAviso($idaviso, $start, $limit)
    {
        $dests = DatPersonaNotificaciones:: getPersonsByAviso(
            $idaviso, $start, $limit
        );
        $i = 0;
        foreach ($dests as $dest) {
            $dests[$i++]['contacto'] = self:: getName($dest['iddest']);
        }

        return $dests;
    }

    public static function getTotalByAviso($idaviso)
    {
        return DatPersonaNotificaciones:: getTotalPersonsByAviso($idaviso);
    }
    
    /**
     * Metodo que devuelve si existe o no un grupo con al menos un destinatario
     * @return bool
     */
    public static function existeGrupoconDestinatarios()
    {
        return DatPersonaNotificaciones::ExistGroupWithDestinatarios();
    }

}
