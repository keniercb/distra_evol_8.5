<?php

/**
 * Description of ExportarImportarModel
 *
 * @author Kenier Cumba Bueno
 */
class ExportarImportarModel extends BaseModel
{

    const FORMATO_XLS = 1,
        FORMATO_XML = 2;

    private $maestroProductosModel;


    public function __construct(MaestroProductoModel $maestro)
    {
        parent::__construct();
        $this->maestroProductosModel = $maestro;
    }

    /**
     * Metodo que importa los datos del nomenclador de productos desde un fichero
     */
    public function importarNomenlclador($datos, $formato = ExportarImportarModel::FORMATO_XLS)
    {
        
    } /**
     * Metodo que importa los datos del nomenclador de productos desde un fichero
     */
    public function obtenerIndicadores($filtrosExportar = array(), $format = ExportarImportarModel::FORMATO_XLS)
    {

        $filtros = $this->getFiltrosExportar($filtrosExportar);
       // $sqlExportar ="SELECT i.idindicadorcentrobalance from public.dat_indicadorcentrobalance i";
        $sqlExportar ="SELECT um.abreviaturaunidadmedida as umedida,i.denominacion, i.codigo,ih.peso,ih.largo,"
            . "ih.ancho,ih.alto,i.numeropieza, ip.seguro, ip.preciodivisa, ip.precio, ip.flete, ip.contingencia, "
            . "ip.precioventa, ip.margencomercial, ip.cobertura,"
            . " case when ip.balanceable = 1 then 'SI' else 'NO' end as balance,"
            . "CASE ip.idaprobacion when 3 then 'Especialista' when 4 then 'Jefe' when 1 then 'No Aprobado' end as aprobado,  ip.idaprobacion, case when ip.nivelplanif = 1 then 'SI' else 'NO' end as nivelplan, "
            . "i.idindicador, m.denominacion as marca, mm.denominacion as modelo, np.siglas as pais, "
            . "nat.denominacion as naturaleza, pf.nombre as nivel, esp.abrevespecialidad as especialidad "
            . "FROM mod_datosmaestros.nom_indicador i "
            . "left join mod_datosmaestros.nom_indicadorhoja ih on i.idindicador = ih.idindicador "
            . "left join mod_datosmaestros.nom_indicadorplanif ip on i.idindicador = ip.idindicador "
            . "left join mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = i.idumedida "
            . "left join mod_datosmaestros.nom_marca m on ih.idmarca = m.idmarca "
            . "left join mod_datosmaestros.nom_modelo mm on ih.idmodelo = mm.idmodelo "
            . "left join mod_datosmaestros.nom_pais np on i.idpais = np.idpais "
            . "left join mod_datosmaestros.nom_naturaleza nat on i.idnaturaleza = nat.idnaturaleza "
            . "left join mod_datosmaestros.dat_formato f on  i.idformato = f.idformato "
            . "left join mod_datosmaestros.dat_parteformato pf on f.idformato = pf.idformato AND i.nivel = pf.nivel "
            . "left join mod_datosmaestros.nom_especialidad esp on i.idespecialidad = esp.idespecialidad "
            . " {$filtros} order by i.codigo";

        /*nuevo*/
        $cant = $this->doctrineHelper->getConnection()->execute($sqlExportar)->fetchAll(PDO::FETCH_ASSOC);
        // $sqlExportar .= " offset {$filtro['start']} limit {$filtro['limit']}";
        $datos = $this->doctrineHelper->getConnection()->execute($sqlExportar)->fetchAll(PDO::FETCH_ASSOC);

        return array('cantidad' => count($cant), 'datos' => $datos);

    }

    /**
     * Metodo que exporta el nomenclador de productos hacia un fichero
     */
    public function exportarNomenlclador($filtrosExportar = array(), $format = ExportarImportarModel::FORMATO_XLS)
    {
        // Los datos
        //El PHPExcel
        //1- Crear fichero
        mkdir('tmp');
        //$datos = $this->obtenerIndicadores($filtrosExportar,$format);
        $datos = $this->obtenerIndicadores($filtrosExportar,$format);
        $limit = 100000;
       /* $columnas = array(
            array(
                'header' => 'C&oacute;digo',
                'dataIndex' => 'idindicadorcentrobalance'
            ),
        );*/
        $columnas = array(
            array(
                'header' => 'C&oacute;digo',
                'dataIndex' => 'codigo'
            ),
            array(
                'header' => 'Denominaci&oacute;n',
                'dataIndex' => 'denominacion'
            ),
            array(
                'header' => 'UM',
                'dataIndex' => 'umedida'
            ),
            array(
                'header' => 'No. Pieza',
                'dataIndex' => 'numeropieza'
            ),
            array(
                'header' => 'Naturaleza',
                'dataIndex' => 'naturaleza'
            ),
            array(
                'header' => 'Nacionalidad',
                'dataIndex' => 'pais'
            ),
            array(
                'header' => 'Especialidad',
                'dataIndex' => 'especialidad'
            ),
            array(
                'header' => 'Nivel',
                'dataIndex' => 'nivel'
            ),
            array(
                'header' => 'Marca',
                'dataIndex' => 'marca'
            ),
            array(
                'header' => 'Modelo',
                'dataIndex' => 'modelo'
            ),
            array(
                'header' => 'Precio',
                'dataIndex' => 'precio'
            ),
            array(
                'header' => 'Precio MLC',
                'dataIndex' => 'preciodivisa'
            ),
            array(
                'header' => 'Precio de venta',
                'dataIndex' => 'precioventa'
            ),
            array(
                'header' => 'Margen comercia',
                'dataIndex' => 'margencomercial'
            ),
            array(
                'header' => 'Cobertura',
                'dataIndex' => 'cobertura'
            ),
            array(
                'header' => 'Flete/Seguro',
                'dataIndex' => 'flete'
            ),
            array(
                'header' => 'Contingencia',
                'dataIndex' => 'contingencia'
            ),
            array(
                'header' => 'Incluir en el balance',
                'dataIndex' => 'balance'
            ),
            array(
                'header' => 'Aprobado',
                'dataIndex' => 'aprobado'
            ),
            array(
                'header' => 'Nivel de planificaci&oacute;n',
                'dataIndex' => 'nivelplan'
            ),
        );
        $excel = null;
        $i = 1;
        $j = 1;
        foreach($datos['datos'] as $index => $dat ){
            if(!$excel){
                $excel = new ExcelWriter("tmp/excel{$i}.xls","Hoja # {$i}");
                foreach ($columnas as $col) {
                    $excel->writeCol('<b>'.$col['header'].'</b>');
                }
            }
            if($excel && $j <= $limit){
                $excel->writeRow();
                foreach ($columnas as $col) {
                    if ($col['dataIndex'] == 'codigo'){
                        $excel->writeCol("<b>{$dat[$col['dataIndex']]}</b>");
                    }else{
                        $excel->writeCol($dat[$col['dataIndex']]);
                    }

                }
                $j++;
            } else {
                $i++;
                $j = 1;
                $excel->close();
                $excel = null;
            }
        }
        //2- Unir excel
        $target = PHPExcel_IOFactory::load("tmp/excel1.xls");
        $target->getActiveSheet()->setTitle("Hoja # 1");
        for($w=2;$w<=$i;$w++) {
            $this->mergeXls("tmp/excel{$w}.xls",$target,$w);
        }
        $objWriter = PHPExcel_IOFactory::createWriter($target, "Excel2007");/*
        header("Content-Type: application/vnd.ms-excel");
        header("Content-Disposition: attachment; filename=excel1.xls");
        header("Cache-Control: max-age=0");*/
        $objWriter->save("tmp/excel1.xls");
        return '/logistica/utiles/maestroproductos/' . "tmp/excel1.xls";
        //$objWriter->save('php://output');
    }

    public function mergeXls($fromFileName,&$target,$index) {
        $from = PHPExcel_IOFactory::load($fromFileName);
        $sc =   $from->getActiveSheet()->copy();
        $clonedSheet = clone $sc;
        $ficheName = "Hoja #".$index;
        $temporarySheet = clone $clonedSheet;
        $temporarySheet->setTitle($ficheName);
        $target->addSheet($temporarySheet);
        $target->setActiveSheetIndex($target->getIndex($temporarySheet));
        unset($temporarySheet);


        /*
        foreach($from->getAllSheets() as $sheet) {
            $target->addExternalSheet($sheet);
        }*/
    }
  /*  public function generarExcel(){
        $objPHPExcel = new PHPExcel();
        $objPHPExcel->getProperties()->setCreated('Distra ERP')
            ->setLastModifiedBy('Distra ERP')
            ->setTitle('Listado de indicadores')
            ->setDescription('Listado de indicadores');
        $sqlEspcialidad = "select distinct ee.idespecialidad , ee.abrevespecialidad
                            from mod_datosmaestros.nom_especialidad ee
                            inner join mod_datosmaestros.nom_indicador i on i.idespecialidad = ee.idespecialidad";
        $especialidades = $this->doctrineHelper->getConnection()->fetchAll($sqlEspcialidad);
        $sheet = 0;
        $cont=1;

        foreach ($especialidades as $esp){
            $objPHPExcel->setActiveSheetIndex($sheet++);
            if($esp['abrevespecialidad']==null){
                $objPHPExcel->getActiveSheet()->setTitle('SD-'.$cont++);
            }else{
                $objPHPExcel->getActiveSheet()->setTitle($esp['abrevespecialidad']);
            }
            $this->writeData($objPHPExcel, $esp['idespecialidad']);
            $objPHPExcel->createSheet($sheet);
        }
        mkdir('tmp');
        $semilla = mktime();
        $fichero = "tmp/{$semilla}_indicadores.xlsx";
        $objPHPExcel->setActiveSheetIndex(0);
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
        $objWriter->save($fichero);
        return '/logistica/utiles/maestroproductos/' . $fichero;
    }*/
    public function writeData($excel,$datos, $columnas)
    {
        foreach ($columnas as $col) {
            $excel->writeCol($col['header']);
        }
        foreach ($datos as $dato) {
            $excel->writeRow();
            foreach ($columnas as $col) {
                $index = $col['dataIndex'];
                $excel->writeCol($dato[$index]);
            }
        }
    }
    /*
    public function writeData(PHPExcel $phpExcel, $idEspecialidad){

        $sqlExportar = "SELECT i.codigo,i.denominacion,um.abreviaturaunidadmedida as umedida,i.numeropieza,"
            ."nat.denominacion as naturaleza, np.siglas as pais,esp.abrevespecialidad as especialidad,"
            ."CASE ip.idaprobacion when 3 then 'Especialista' when 4 then 'Jefe' when 1 then 'No Aprobado' end as aprobado,"
            ."m.denominacion as marca, mm.denominacion as modelo, ip.precio,ip.preciodivisa,ip.precioventa,"
            ."ip.margencomercial, ip.cobertura,ip.flete, ip.contingencia,"
            ."case when ip.balanceable = 1 then 'SI' else 'NO' end as balance,"
            ."case when ip.nivelplanif = 1 then 'SI' else 'NO' end as nivelplan "
            . "FROM mod_datosmaestros.nom_indicador i "
            . "left join mod_datosmaestros.nom_indicadorhoja ih on i.idindicador = ih.idindicador "
            . "left join mod_datosmaestros.nom_indicadorplanif ip on i.idindicador = ip.idindicador "
            . "left join mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = i.idumedida "
            . "left join mod_datosmaestros.nom_marca m on ih.idmarca = m.idmarca "
            . "left join mod_datosmaestros.nom_modelo mm on ih.idmodelo = mm.idmodelo "
            . "left join mod_datosmaestros.nom_pais np on i.idpais = np.idpais "
            . "left join mod_datosmaestros.nom_naturaleza nat on i.idnaturaleza = nat.idnaturaleza "
            . "left join mod_datosmaestros.dat_formato f on  i.idformato = f.idformato "
            . "left join mod_datosmaestros.dat_parteformato pf on f.idformato = pf.idformato AND i.nivel = pf.nivel "
            . "left join mod_datosmaestros.nom_especialidad esp on i.idespecialidad = esp.idespecialidad "
            . " where  i.idespecialidad =  {$idEspecialidad} order by i.codigo";
        $columnas = array(
            array(
                'header' => 'Codigo',
                'column' => 'A',
                'dataIndex' => 'codigo'
            ),
            array(
                'header' => 'Denominacion',
                'column' => 'B',
                'dataIndex' => 'denominacion'
            ),
            array(
                'header' => 'UM',
                'column' => 'C',
                'dataIndex' => 'umedida'
            ),
            array(
                'header' => 'No. Pieza',
                'column' => 'D',
                'dataIndex' => 'numeropieza'
            ),
            array(
                'header' => 'Naturaleza',
                'column' => 'E',
                'dataIndex' => 'naturaleza'
            ),
            array(
                'header' => 'Nacionalidad',
                'column' => 'F',
                'dataIndex' => 'pais'
            ),
            array(
                'header' => 'Especialidad',
                'column' => 'G',
                'dataIndex' => 'especialidad'
            ),
            array(
                'header' => 'Nivel',
                'column' => 'H',
                'dataIndex' => 'nivel'
            ),
            array(
                'header' => 'Marca',
                'column' => 'I',
                'dataIndex' => 'marca'
            ),
            array(
                'header' => 'Modelo',
                'column' => 'J',
                'dataIndex' => 'modelo'
            ),
            array(
                'header' => 'Precio',
                'column' => 'K',
                'dataIndex' => 'precio'
            ),
            array(
                'header' => 'Precio MLC',
                'column' => 'L',
                'dataIndex' => 'preciodivisa'
            ),
            array(
                'header' => 'Precio de venta',
                'column' => 'M',
                'dataIndex' => 'precioventa'
            ),
            array(
                'header' => 'Margen comercia',
                'column' => 'N',
                'dataIndex' => 'margencomercial'
            ),
            array(
                'header' => 'Cobertura',
                'column' => 'O',
                'dataIndex' => 'cobertura'
            ),
            array(
                'header' => 'Flete/Seguro',
                'column' => 'O',
                'dataIndex' => 'flete'
            ),
            array(
                'header' => 'Contingencia',
                'column' => 'P',
                'dataIndex' => 'contingencia'
            ),
            array(
                'header' => 'Incluir en el balance',
                'column' => 'Q',
                'dataIndex' => 'balance'
            ),
            array(
                'header' => 'Aprobado',
                'column' => 'R',
                'dataIndex' => 'aprobado'
            ),
            array(
                'header' => 'Nivel de planificacion',
                'column' => 'S',
                'dataIndex' => 'nivelplan'
            ),
        );
        $phpExcel->getActiveSheet()->fromArray($this->doctrineHelper->getConnection()->fetchAll($sqlExportar),null,'A2');
        foreach ($columnas as $index=>$col){
            $phpExcel->getActiveSheet()->setCellValueByColumnAndRow($index,1, $col['header']);
        }
    }*/
/* public function exportarOrgano()
    {
        $dirname = dirname($_SERVER['SCRIPT_FILENAME']) . "/tmp/";
        array_map('unlink', glob("$dirname/*.*"));
        mkdir('tmp');
        $semilla = mktime();
        $fichero = "tmp/{$semilla}_informe.xls";
        $excel = new ExcelWriter($fichero);
        $datos = $this->cargarOrganos()['datos'];
        $columns = array(
            array('header' => 'Denominacion', 'dataIndex' => 'denominacion')
        );
        $excel->writeData($datos, $columns);
        $excel->close();
        return '/configuracion/nomgenerales/' . $fichero;
    }*/
    public function generarExcel2(/*$idIndicadoresExportar = array()*/)
    {
        mkdir('tmp');
        $semilla = mktime();
        $fichero = "tmp/{$semilla}_indicadores.xls";
        $excel = new ExcelWriter($fichero);
        $datos=$this->exportarNomenlclador()['datos'];
        $columnas = array(
            array(
                'header' => 'C&oacute;digo',
                'dataIndex' => 'codigo'
            ),
            array(
                'header' => 'Denominaci&oacute;n',
                'dataIndex' => 'denominacion'
            ),
            array(
                'header' => 'UM',
                'dataIndex' => 'umedida'
            ),
            array(
                'header' => 'No. Pieza',
                'dataIndex' => 'numeropieza'
            ),
            array(
                'header' => 'Naturaleza',
                'dataIndex' => 'naturaleza'
            ),
            array(
                'header' => 'Nacionalidad',
                'dataIndex' => 'pais'
            ),
            array(
                'header' => 'Especialidad',
                'dataIndex' => 'especialidad'
            ),
            array(
                'header' => 'Nivel',
                'dataIndex' => 'nivel'
            ),
            array(
                'header' => 'Marca',
                'dataIndex' => 'marca'
            ),
            array(
                'header' => 'Modelo',
                'dataIndex' => 'modelo'
            ),
            array(
                'header' => 'Precio',
                'dataIndex' => 'precio'
            ),
            array(
                'header' => 'Precio MLC',
                'dataIndex' => 'preciodivisa'
            ),
            array(
                'header' => 'Precio de venta',
                'dataIndex' => 'precioventa'
            ),
            array(
                'header' => 'Margen comercia',
                'dataIndex' => 'margencomercial'
            ),
            array(
                'header' => 'Cobertura',
                'dataIndex' => 'cobertura'
            ),
            array(
                'header' => 'Flete/Seguro',
                'dataIndex' => 'flete'
            ),
           /* array(
                'header' => 'Seguro',
                'dataIndex' => 'seguro'
            ),*/
            array(
                'header' => 'Contingencia',
                'dataIndex' => 'contingencia'
            ),
            array(
                'header' => 'Incluir en el balance',
                'dataIndex' => 'balance'
            ),
            array(
                'header' => 'Aprobado',
                'dataIndex' => 'aprobado'
            ),
            array(
                'header' => 'Nivel de planificaci&oacute;n',
                'dataIndex' => 'nivelplan'
            ),
        );
        foreach ($columnas as $pos => $col){
            $columnas[$pos]['header'] = '<b>'.$col['header'].'</b>';
        }
        $excel->writeData($datos, $columnas);
        //$excel->writeData($idIndicadoresExportar, $columnas);
        $excel->close();
        return '/logistica/utiles/maestroproductos/' . $fichero;
    }

    public function getFiltrosExportar($filtrosExportar)
    {
        if ($filtrosExportar['idespecialidad'] == -1) {
            $especialidades = $this->configuracionHelper->obtenerEspecialidades();
            if (count($especialidades) == 0 && $filtrosExportar['restringir'] == 1) {
                $params['idEspecialidad'] = -1;
                return;
            }
            $filtrosExportar['idespecialidad'] = LogisticaObjectHelper::__init()
                ->extractValueFromArrayColumn($especialidades, 'idespecialidad');
            //return "";
        }
    }

}
