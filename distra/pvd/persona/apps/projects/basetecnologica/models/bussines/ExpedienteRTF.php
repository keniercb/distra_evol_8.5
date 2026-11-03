<?php
class ExpedienteRTF
{

    var $rtf;
    var $data;

    public function ExpedienteRTF($fichaData)
    {
        $dir = $_SERVER ['DOCUMENT_ROOT'];
        $apps = str_replace('/web', '/', $dir);
        require_once($apps . 'apps/pvd/comun/recursos/rtf/Rtf.php');
        $this->data = $fichaData;
    }

    public function CrearExpediente($idpersona)
    {
        $datos = $this->obtenerDatos($idpersona);
        $trayectoria = $this->getTrayectoria($idpersona);
        $neduc = DatNiveleducacional::getNivelEduByPersona($idpersona);
        $nivelprep = $neduc[0]['niveleducacional'];
        $sanciones = DatSancion::getSancionesByPersona(array($idpersona));
        $afiliaciones = DatAfiliacion::getAfiliacionesByPersona(array($idpersona));
        $organizaciones = '';
        foreach ($afiliaciones as $aff) {
            $organizaciones .= $aff['denomorganizacion'].' ';
        }
        $this->rtf = new Rtf();
        $sect = &$this->rtf->addSection();
        $sect->setPaperHeight(27.94);
        $sect->setPaperWidth(21.59);
        $sect->setMargins(2, 2, 2, 1);
        $table = &$sect->addTable('center');
        $table->addRows(3, 0.7);
        $table->addColumnsList(array(20));
        $table->writeToCell(1, 1, '<b>Ministerio de trabajo y seguridad social</b>', new Font(12, Arial), new ParFormat('center'));

        $tablec = &$sect->addTable('center');
        $tablec->addRows(10, 0.5);
        $tablec->addColumnsList(array(10, 10));
        $tablec->setDefaultAlignmentOfCells('center', 1, 1, 10, 2);
        $tablec->setVerticalAlignmentOfCells('center', 1, 1, 10, 2);
        $tablec->setBordersOfCells(
            new BorderFormat(1, "#000000"), 1, 1, 10, 2, true, true, true, true
        );
        $tablec->writeToCell(1, 1, '<b>Nombre y apellidos: </b>'. $datos['nombreapellidos'], new Font(10, Arial), new ParFormat('left'));
        $tablec->writeToCell(1, 2, '<b>Número de identidad: </b>' . $datos['numid'], new Font(10, Arial), new
        ParFormat('left'));
        $tablec->writeToCell(2, 1, '<b>Dirección particular: </b>', new Font(10, Arial),new
        ParFormat('left'));
        $tablec->writeToCell(3, 1, $datos['direccion'], new Font(10, Arial), new ParFormat('left'));
        $tablec->writeToCell(2, 2, '<b>Estado civil: </b>'. $datos['estadocivil'], new Font(10, Arial), new ParFormat('left'));
        $tablec->writeToCell(3, 2, '<b>Nivel escolar: </b>'.$nivelprep,  new Font(10, Arial), new ParFormat('left'));
        $tablec->writeToCell(4, 1, '<b>Municipio: </b>' . $datos['municipio'], new Font(10, Arial), new ParFormat('left'));
        $tablec->writeToCell(5, 1, '<b>Provincia: </b>' . $datos['provincia'], new Font(10, Arial), new ParFormat('left'));
        $tablec->writeToCell(6, 1, '<b>Ocupación ocargo que desempeñó: </b>', new Font(10, Arial), new ParFormat('left'));
        $tablec->writeToCell(7, 1, $trayectoria[0]['cargo'], new Font(10, Arial), new ParFormat('left'));
        $tablec->writeToCell(6, 2, '<b>Salario devengado: </b>', new Font(10, Arial), new ParFormat('left'));
        $tablec->writeToCell(7, 2, '<b>Ultima sanción laboral: </b>', new Font(10,Arial), new ParFormat('left'));
        $tablec->writeToCell(8, 2, $sanciones[0]['denomsancion'], new Font(10, Arial), new ParFormat('left'));
        $tablec->writeToCell(8, 1, '<b>Causa de la baja: </b>'.$trayectoria[0]['motivobaja'], new Font(10, Arial),
            new ParFormat('left'));
        $tablec->writeToCell(9, 1, '<b>Militancia: </b>', new Font(10, Arial), new ParFormat('left'));
        $tablec->writeToCell(9, 2, '<b>Organizaciones: </b>'. $organizaciones, new Font(10, Arial), new ParFormat('left'));
        $tablec->writeToCell(10, 1, '<b>Centro de trabajo donde laboró: </b>', new Font(10, Arial), new ParFormat('left'));
        $tablec->writeToCell(10, 2, '<b>Dirección: </b>', new Font(10, Arial), new ParFormat('left'));
        $tabled = &$sect->addTable('center');
        $tabled->addRows(1, 0.5);
        $tabled->addColumnsList(array(20));
        $tabled->setBordersOfCells(new BorderFormat(1, "#000000"), 1, 1, 1, 1, true, true, true, true);
        $tabled->setDefaultAlignmentOfCells('center', 1, 1, 10, 2);
        $tabled->setVerticalAlignmentOfCells('center', 1, 1, 10, 2);
        $tabled->writeToCell(
            1, 1, '<b>Relación de centros de trabajos donde trabajó</b>', new Font(10, Arial), new ParFormat('center')
        );
        $tablee = &$sect->addTable('center');
        $tablee->addRows(5, 0.5);
        $tablee->addColumnsList(array(3, 3, 7, 7));
        $tablee->setDefaultAlignmentOfCells('center', 1, 1, 10, 2);
        $tablee->setVerticalAlignmentOfCells('center', 1, 1, 10, 2);
        $tablee->setBordersOfCells(new BorderFormat(1, "#000000"), 1, 1, 5, 4, true, true, true, true);
        $tablee->writeToCell(1, 1, '<b>F. alta</b>', new Font(10, Arial), new ParFormat('left'));
        $tablee->writeToCell(1, 2, '<b>F. baja</b>', new Font(10, Arial), new ParFormat('left'));
        $tablee->writeToCell(1, 3, '<b>Organismo</b>', new Font(10, Arial), new ParFormat('left'));
        $tablee->writeToCell(1, 4, '<b>Entidad o establecimiento</b>', new Font(10, Arial), new ParFormat('left'));
        foreach ($trayectoria as $p=>$tray) {
            if ($p < 4) {
                $tablee->writeToCell($p + 2, 1, $tray['falta'], new Font(10, Arial), new ParFormat('left'));
                $tablee->writeToCell($p + 2, 2, $tray['fbaja'], new Font(10, Arial), new ParFormat('left'));
                //$tablee->writeToCell($p+2, 3, $tray[''], new Font(10, Arial), new ParFormat('left'));
                $tablee->writeToCell(
                    $p + 2, 4, $tray['orgentidad'], new Font(10, Arial), new ParFormat('left')
                );
            } else {
                break;
            }
        }

        $tablef = &$sect->addTable('center');
        $tablef->addRows(1, 0.5);
        $tablef->addColumnsList(array(20));
        $tablef->setBordersOfCells(new BorderFormat(1, "#000000"), 1, 1, 1, 1, true, true, true, true);
        $tablef->setDefaultAlignmentOfCells('center', 1, 1, 5, 4);
        $tablef->setVerticalAlignmentOfCells('center', 1, 1, 5, 4);
        $tablef->writeToCell(
            1, 1, '<b>Total de Salario Devengados en cada uno de los últimos 10 años</b>', new Font(10, Arial), new
            ParFormat('center')
        );
        $tableg = &$sect->addTable('center');
        $tableg->addRows(12, 0.5);
        $tableg->addColumnsList(array(6, 14));
        $tableg->setDefaultAlignmentOfCells('center', 1, 1, 12, 2);
        $tableg->setVerticalAlignmentOfCells('center', 1, 1, 12, 2);
        $tableg->setBordersOfCells(
            new BorderFormat(1, "#000000"), 1, 1, 12, 2, true, true, true, true
        );
        $tableg->writeToCell(
            1, 1, '<b>Años</b>', new Font(10, Arial), new ParFormat('left')
        );
        $tableg->writeToCell(
            1, 2, '<b>Salarios Devengados</b>', new Font(10, Arial), new ParFormat('left')
        );
        $tableh = &$sect->addTable('center');
        $tableh->addRows(3, 0.5);
        $tableh->addColumnsList(array(20));
        $tableh->setBordersOfCells(
            new BorderFormat(1, "#000000"), 1, 1, 3, 1, true, true, true, true
        );
        $tableh->setDefaultAlignmentOfCells('center', 1, 1, 3, 1);
        $tableh->setVerticalAlignmentOfCells('center', 1, 1, 3, 1);
        $tableh->writeToCell(1, 1, '<b>Otras informaciones del trabajador</b>', new Font(10, Arial), new ParFormat('left'));
        $tableh->writeToCell(
            2, 1, '<b>Evaluaciones:</b>', new Font(10, Arial), new ParFormat('left')
        );
        $tableh->writeToCell(
            2, 1, '<b>Sanciones anteriores:</b>', new Font(10, Arial), new ParFormat('left')
        );
        for ($i = 1; $i < count($sanciones); $i++) {
            $tableh->writeToCell(
                2, 1, '- '.$sanciones[$i]['denomsancion'], new Font(10, Arial), new ParFormat('left')
            );
        }
        $tableh->writeToCell(
            2, 1, '<b>Trayectoria como recién graduado:</b>', new Font(10, Arial), new ParFormat('left')
        );
        $tableh->writeToCell(
            2, 1, '<b>Total de años de servicio y salario devengados:</b>', new Font(10, Arial), new ParFormat('left')
        );
        $tableh->writeToCell(
            2, 1, '<b>Registro de Inscripción profesionales:</b>', new Font(10, Arial), new ParFormat('left')
        );
        $tableh->writeToCell(
            3, 1, '<b>Observación:</b>', new Font(10, Arial), new ParFormat('left')
        );
        $tablei = &$sect->addTable('center');
        $tablei->addRows(1, 0.5);
        $tablei->addColumnsList(array(17, 3));
        $tablei->setDefaultAlignmentOfCells('center', 1, 1, 1, 1);
        $tablei->setVerticalAlignmentOfCells('center', 1, 1, 1, 1);
        $tablei->writeToCell(1, 1, '<b>Fecha:</b>', new Font(10, Arial), new ParFormat('right'));

        $this->rtf->save("Expediente.rtf");
    }

    private function obtenerDatos($idpersona)
    {
        $sql = "SELECT dp.idpersona, dpi.numero as numid, np.denominacion as provincia, nm.denominacion as municipio, dd.direccion,
                (CASE WHEN dp.snombre is not null THEN dp.nombre||' '|| dp.snombre||' '|| dp.papel||' '||  dp.sapel
                                        ELSE dp.nombre||' '|| dp.papel||' '||  dp.sapel END) as nombreapellidos, nec.denominacion as estadocivil
                  FROM mod_persona.dat_persona AS dp
                LEFT JOIN mod_personaext.dat_caracteristicasocial dcs ON (dcs.idpersona = dp.idpersona)
                LEFT JOIN mod_persona.dat_docidentidad dpi ON (dpi.idpersona = dp.idpersona and dpi.principal = 1)
                LEFT JOIN mod_persona.dat_direccion dd ON (dd.idpersona = dp.idpersona and dd.oficial = 1)
                LEFT JOIN mod_datosmaestros.nom_dpt np ON (dd.idprovincia = np.iddpt)
                LEFT JOIN mod_datosmaestros.nom_dpt nm ON (dd.idmunicipio = nm.iddpt)
                LEFT JOIN mod_personaext.nom_estadocivil nec ON (dcs.idestadocivil = nec.idestadocivil)
                WHERE dp.idpersona = $idpersona";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $resut = $conn->fetchAll($sql);
        return $resut[0];
    }

    private function getTrayectoria($idpersona)
    {
        $sql = "SELECT DISTINCT ON (htl.orgentidad) orgentidad, htl.idpersona, htl.falta, htl.fbaja, htl.cargo, mb.denominacion as motivobaja
        FROM mod_personaext.his_trayectorialaboral htl
        LEFT JOIN mod_fuerzatrabajo.nom_motivobaja mb ON (htl.motivobaja = mb.idmotivobaja)
        WHERE htl.fbaja IS NOT NULL AND htl.idpersona = $idpersona 
        ORDER BY htl.orgentidad, htl.falta DESC";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $resut = $conn->fetchAll($sql);
        return $resut;
    }
}