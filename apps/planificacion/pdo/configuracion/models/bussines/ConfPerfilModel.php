<?php

class ConfPerfilModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function EliminarInvolucradosAConfiguracion(
        $usuarioseliminar, $idconfiguracionperfil, $tipoconf
    ) 
    {
        if (isset($usuarioseliminar[0])) {
            foreach ($usuarioseliminar as $involucrado) {
                $idinvolucrado = ($involucrado->tipo != 0)
                    ? $involucrado->idusuario : $involucrado->idgrupo;
                if ($tipoconf == 'calendario') {
                    $eliminar = Doctrine::getTable(
                        'DatConfperfilcalendarioUsuariosinvolucrados'
                    )->findByDql(
                        "idconfiguracionperfil = $idconfiguracionperfil 
                            AND idinvolucrado = $idinvolucrado"
                    );
                    if ($eliminar[0]->idconfiguracionperfil != null) {
                        $eliminar[0]->delete();
                    }
                } else {
                    $eliminar = Doctrine::getTable(
                        'DatPerfilinvolucradoUsuariosinvolucrados'
                    )->findByDql(
                        "idconfiguracionperfil = $idconfiguracionperfil 
                            AND idinvolucrado = $idinvolucrado"
                    );
                    if ($eliminar[0]->idconfiguracionperfil != null) {
                        $eliminar[0]->delete();
                    }
                }

            }
        }
    }


}

