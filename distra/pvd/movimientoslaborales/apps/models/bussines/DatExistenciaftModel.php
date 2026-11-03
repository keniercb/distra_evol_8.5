<?php
class DatosJubilacionModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getRegistroSalario($idpersona)
    {
        //Datos registro salario de la persona por año ordenado
        $datosregistrosalario = $this->obtenerListadoDatRegistroSalarioOrdenadoAnnosMeses($idpersona);
        //Sumando
        $datos = Array();
        $cont = -1;
        foreach ($datosregistrosalario as $i => $value) {
            if ($i == 0 || $value['anno'] != $datosregistrosalario[$i-1]['anno']) {
                $cont++;
                $datos[$cont]['anno'] = $value['anno'];
                $datos[$cont]['salario'] = $value['salario'];
                $datos[$cont]['meses'] = 1;
            } else {
                $datos[$cont]['salario'] += $value['salario'];
                $datos[$cont]['meses'] += 1;
            }

        }
        return $datos;
    }

    private function obtenerListadoDatRegistroSalarioOrdenadoAnnosMeses($idpersona)
    {
        $sql = "SELECT anno, SUM(salariodevengado) as salario, idmes
                FROM mod_nomina.dat_registrosalariotiemposervcio
                WHERE idpersona = $idpersona
                GROUP BY anno, idmes ORDER BY anno, idmes;";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $dat = $conn->fetchAll($sql);
        return $dat;
    }

    public function getTrayectoriaLaboral($idpersona)
    {
        $sql = "SELECT htl.orgentidad, htl.idpersona, htl.fdesde, htl.fhasta, htl.cargo
        FROM mod_personaext.his_trayectorialaboral htl
        WHERE htl.idpersona = $idpersona 
        ORDER BY htl.fdesde ASC";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $resut = $conn->fetchAll($sql);
        return $resut;
    }

}