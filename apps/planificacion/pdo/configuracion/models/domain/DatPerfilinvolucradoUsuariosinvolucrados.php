<?php

class DatPerfilinvolucradoUsuariosinvolucrados
    extends BaseDatPerfilinvolucradoUsuariosinvolucrados
{

    public function setUp()
    {
        parent:: setUp();
    }

    public function getByid($idtipoinvolucrado)
    {
        return Doctrine::getTable('DatPerfilinvolucradoUsuariosinvolucrados')
            ->find($idtipoinvolucrado)->toArray();
    }

    public function getInvolucradosConfPerfilComportamiento(
        $idconiguracionperfil
    )
    {
        $cadenaSELECT
            = "SELECT i.idinvolucrado,i.idtipo, ti.idtipoinvolucrado,
             n.dennomenclador as tipoinvolucrado";
        $cadenaJOIN
            = " FROM mod_objetivos.dat_perfilinvolucrado_usuariosinvolucrados i
                        INNER JOIN mod_objetivos.nom_tipoinvolucrado ti
                        ON i.idtipoinvolucrado = ti.idtipoinvolucrado
                        INNER JOIN mod_objetivos.nom_nomenclador n
                        ON n.idnomenclador = ti.idtipoinvolucrado ";
        $cadenaWHERE
            = " WHERE i.idconfiguracionperfil = {$idconiguracionperfil}
                         GROUP BY i.idinvolucrado,i.idtipo,
                         ti.idtipoinvolucrado, n.dennomenclador";

        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaQUERY)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }


}

