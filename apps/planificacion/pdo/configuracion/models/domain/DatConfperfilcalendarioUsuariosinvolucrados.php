<?php

class DatConfperfilcalendarioUsuariosinvolucrados extends
    BaseDatConfperfilcalendarioUsuariosinvolucrados
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'ConfPerfilcalendario', array('local'   => 'idconfiguracionperfil',
                                          'foreign' => 'idconfiguracionperfil')
        );
    }

    public function getByid($idestructura)
    {
        return Doctrine::getTable('DatConfperfilcalendarioUsuariosinvolucrados')
            ->find($idestructura)->toArray();
    }

    public function getInvolucradosConfPerfilCalendario($idconiguracionperfil)
    {
        $cadenaSELECT = '';
        $cadenaJOIN = '';
        $cadenaWHERE = '';
        $cadenaQUERY = '';

        $cadenaSELECT = "SELECT i.idinvolucrado,i.idtipo ";
        $cadenaJOIN
            = " FROM mod_objetivos.dat_confperfilcalendario_usuariosinvolucrados i ";
        $cadenaWHERE
            = " WHERE i.idconfiguracionperfil = {$idconiguracionperfil} ";

        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaQUERY)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }


}
