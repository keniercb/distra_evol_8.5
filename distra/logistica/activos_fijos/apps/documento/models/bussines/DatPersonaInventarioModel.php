<?php

class DatPersonaInventarioModel extends BaseModel
{

    /**
     *
     */
    public function __construct()
    {
        parent:: __construct();
    }

    /**
     *
     */
    public function getIdPersonasByIdDoc($idDocumento)
    {
        $query = Doctrine_Query::create();
        $respuesta = array();

        $query->select('p.idpersona')
            ->from('DatPersonaInventario p')
            ->where('p.iddocumento =?', $idDocumento);

        foreach ($query->fetchArray() as $value) {
            $respuesta[] = $value['idpersona'];
        }

        return $respuesta;
    }

    /**
     *
     */
    public function actualizarPersonas($idDocumento)
    {
        $query = Doctrine_Query::create();

        $query->delete()
            ->from('DatPersonaInventario p')
            ->where('p.iddocumento = ?', $idDocumento)
            ->execute();
    }

}
