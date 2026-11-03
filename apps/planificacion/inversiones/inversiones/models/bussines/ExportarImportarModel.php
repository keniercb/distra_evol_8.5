<?php

/**
 * ExportarImportarModel
 *
 *
 * @ author Danelys Brito Gonzalez
 * @ package Planificaciï¿½n
 * @ subpackage Planificaciï¿½n Empresarial y Presupuestaria
 * @ copyright UCID-ERP Cuba
 * @ version 2.0-0
 * */
class ExportarImportarModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function exportarIndicadoresAExcel($identidaddatosnom)
    {

        $conn = Doctrine_Manager::connection();
        $inds = array();

        $sql
            = "SELECT
          mod_planificacion.nom_indicador.codigo,
          mod_planificacion.nom_indicador.numeropieza,
          mod_planificacion.nom_indicador.denominacion,
          mod_planificacion.dat_indicadorcentrobalance.idindicadorcentrobalance,
          mod_planificacion.nom_indicador.idumedida,
          mod_planificacion.nom_indicador.precio,
          mod_planificacion.nom_indicador.nivelarbol,
          mod_planificacion.nom_indicador.flete,
          mod_planificacion.nom_indicador.contingencia
        FROM
          mod_planificacion.nom_indicador
          INNER JOIN mod_planificacion.dat_indicadorcentrobalance ON (mod_planificacion.nom_indicador.idindicador = mod_planificacion.dat_indicadorcentrobalance.idindicador)
        ORDER BY
          mod_planificacion.nom_indicador.codigo OFFSET 0 LIMIT 100000";

        $inds = $conn->execute($sql)->fetchAll(PDO::FETCH_NUM); //PDO::FETCH_ASSOC
        //Para version html de exportacion con excel

        header("Pragma: public");
        header("Expires: 0");
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=indicadores.xls");
        header("Content-Transfer-Encoding: binary ");

        echo "<table border=1>\n";
        echo "<caption>INDICADORES</caption>\n";
        echo "<tr>\n";
        echo "<th>C&oacute;digo</th>\n";
        echo "<th>Numero de pieza </th>\n"; //ver como se pone la u con tilde
        echo "<th>Denominaci&oacute;n</th>\n";
        echo "<th>Centro de Balance</th>\n";
        echo "<th>Unidad de medida</th>\n";
        echo "<th>Precio</th>\n";
        echo "<th>Fletes y Seguros</th>\n";
        echo "<th>Contingencia</th>\n";
        foreach ($inds as $k => $i) {
            echo "<tr>\n";
            echo "<td>$i[0]</td>\n";
            echo "<td>$i[1]</td>\n";
            echo "<td>$i[2]</td>\n";
            echo "<td>$i[3]</td>\n";
            echo "<td>$i[4]</td>\n";
            echo "<td>$i[5]</td>\n";
            echo "<td>$i[6]</td>\n";
            echo "<td>$i[7]</td>\n";
            echo "<td>$i[8]</td>\n";
            echo "</tr>\n";
        }
        echo "</table>\n";

        return 0;
    }

    public function exportarIndicadoresAExcelViejo($identidaddatosnom)
    {
        /*
          header('Content-type: application/vnd.ms-excel');
          header("Content-Disposition: attachment; filename=indicadores.xls");
          header("Pragma: no-cache");
          header("Expires: 0");
         */

        header("Pragma: public");
        header("Expires: 0");
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=indicadores.xls");
        header("Content-Transfer-Encoding: binary ");


        echo "<table border=1>\n";
        echo "<caption>INDICADORES</caption>\n";
        echo "<tr>\n";
        echo "<th>C&oacute;digo</th>\n";
        echo "<th>Numero de pieza </th>\n"; //ver como se pone la u con tilde
        echo "<th>Denominaci&oacute;n</th>\n";
        echo "<th>Unidad de medida</th>\n";
        echo "<th>Precio</th>\n";
        echo "<th>Centro de Balance</th>\n";
        echo "<th>Nivel de Planificaci&oacute;n</th>\n";
        echo "<th>Activado</th>\n";
        echo "<th>Fletes y Seguros</th>\n";
        echo "<th>Contingencia</th>\n";
        echo "<th>Naturaleza</th>\n";
        echo "<th>Pais</th>\n"; //ver como se pone la i con tilde
        //$idEstructura = $this->global->Estructura->idestructura;
        //$identdnom=DatEntidaddatosnomenclador::getIdentidaddatosnomenclador($idEstructura);
        /* echo'<pre>';
          print_r($identidaddatosnom);die; */
        $indicadores = NomIndicador::ListarIndPorCB($identidaddatosnom); //$identdnom[0]['identidaddatosnomenclador']
        //$data = NomIndicador::listar ( $parametros, $idpadre, $start, $limit, $field, $direction,$idEstructura);
        //$indicadores=NomIndicador::ObtenerTodosIndicadores();


        foreach ($indicadores as $k => $value) {

            echo "<tr>\n";
            $codigoindicador = $value['NomIndicador']['codigo'];

            $nopieza = $value['NomIndicador']['numeropieza'];

            $denominacion = $value['NomIndicador']['denominacion'];

            $unidad = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(Array($value['NomIndicador']['idumedida']));
            $um = $unidad->abreviatura;

            $precio = $value['NomIndicador']['precio'];
            $prec = $precio * 1;
            $identidaddatosnom
                = $value['identidaddatosnomenclador']; //obtengo el idcentro de balance que tiene NomIndicador que no es mas que el identidaddatosnomenclador en DatEntidaddatosnomenclador

            $entidad = DatEntidaddatosnomenclador::getEntidadDadoIdDatos(
                $identidaddatosnom
            ); //busco el id de la entidad en DatEntidaddatosnomenclador dado el identidaddatosnomenclador

            $datosentidad = $this->integrator->metadatos->DameEstructura($entidad[0]['identidad']); //100000024

            $denomcentrobalance
                = $datosentidad[0]->denominacion; //nombre del centro de balance que se muestra en el excel

            $nivelp = $value['NomIndicador']['nivel']; //es 0 o 1

            if ($nivelp == 1) {
                $nivelplanif = 'Si';
            } else {
                $nivelplanif = 'No';
            }

            $estado = $value['NomIndicador']['estado'];

            if ($estado == 1) {
                $activado = 'Si';
            } else {
                $activado = 'No';
            }

            $flete = $value['NomIndicador']['flete'];

            $contingencia = $value['NomIndicador']['contingencia'];

            $idnaturaleza = $value['NomIndicador']['naturaleza'];

            $natura = NomDatosnomenclador::ObtenerDatosDadoIdDatosNom($idnaturaleza);
            $naturaleza = $natura[0]['denominacion'];

            $idpais = $value['NomIndicador']['idpais'];

            $this->nomenclador = new ZendExt_Nomencladores_ADT ();
            $pais = $this->nomenclador->selectParam('nom_pais', array('nombrepais'), 0, 0, "idpais=$idpais");
            $denompais = $pais[0]['nombrepais'];
            /* echo'<pre>';
              print_r($denompais);die;//*****POR AQUI ME QUEDE */
            /* echo'<pre>';
              print_r($denompais);die; */

            echo "<td>$codigoindicador</td>\n";
            echo "<td>$nopieza</td>\n";
            echo "<td>$denominacion</td>\n";
            echo "<td>$um</td>\n";
            echo "<td>$prec</td>\n";
            echo "<td>$denomcentrobalance</td>\n";
            echo "<td>$nivelplanif</td>\n";
            echo "<td>$activado</td>\n";
            echo "<td>$flete</td>\n";
            echo "<td>$contingencia</td>\n";
            echo "<td>$naturaleza</td>\n";
            echo "<td>$denompais</td>\n";
            echo "</tr>\n";
        }
        echo "</table>\n";
    }
}