<?php
class ReporteEstadoviviendaRTF
{
    var $rtf;
    var $datos;

    public function ReporteEstadoviviendaRTF($ficha_data)
    {
        $dir = $_SERVER ['DOCUMENT_ROOT'];
        $apps = str_replace('/web', '/', $dir);
        require_once($apps . 'apps/pvd/comun/recursos/rtf/Rtf.php');
        $this->datos = $ficha_data;
        $this->datosbyentity = array();
    }

    public function CrearFicha()
    {
        $this->rtf = new Rtf();
        $sect = & $this->rtf->addSection();
        $sect->setPaperHeight(27.94);
        $sect->setPaperWidth(21.59);
        $sect->setMargins(1, 1, 1, 1, 1);

        $sect->writeText('<br/><b>Datos Estado de la vivienda</b><br/>', new Font(14, Arial), new ParFormat('center'));

        $table = & $sect->addTable('left');
        $table->addRows(1, 1);
        $table->addColumnsList(array(1, 3, 4, 6, 3, 3));
        $table->setDefaultAlignmentOfCells('center', 1, 1, 1, 6);
        $table->setVerticalAlignmentOfCells('center', 1, 1, 1, 6);
        $cell = & $table->getCell(1, 1);
        $cell->writeText("<b>No.</b>", new Font(12, Arial), new ParFormat('center'));
        $cell1 = & $table->getCell(1, 2);
        $cell1->writeText("<b>No. identidad</b>", new Font(12, Arial), new ParFormat('center'));
        $cell1 = & $table->getCell(1, 3);
        $cell1->writeText("<b>Apellidos y nombres</b>", new Font(12, Arial), new ParFormat('center'));
        $cell1 = & $table->getCell(1, 4);
        $cell1->writeText("<b>Cargo</b>", new Font(14, Arial), new ParFormat('center'));
        $cell1 = & $table->getCell(1, 5);
        $cell1->writeText("<b>Estado de la vivienda</b>", new Font(12, Arial), new ParFormat('center'));
        $cell1 = & $table->getCell(1, 6);
        $cell1->writeText("<b>Situación de convivencia</b>", new Font(12, Arial), new ParFormat('center'));

        foreach ($this->datos as $p => $value) {
            $this->datosbyentity[$value['idarea']][0] = $value['ueb'];
            $this->datosbyentity[$value['idarea']][1] = array();
        }

        foreach ($this->datos as $p => $value) {
            $result = array();
            $result['numid'] = $value['numid'];
            $result['nombreyapellidos'] = $value['nombreyapellidos'];
            $result['cargo'] = $value['cargo'];
            $result['estadovivienda'] = $value['estadovivienda'];
            $result['convivencia'] = $value['convivencia'];
            array_push($this->datosbyentity[$value['idarea']][1], $result);

        }

        foreach ($this->datosbyentity as $key => $value) {
            $table->setBordersOfCells(new BorderFormat(1, "#000000"), 1, 1, 1, 6, true, true, true, true);
            $table = & $sect->addTable('left');
            $table->addRows(1, 1);
            $table->addColumnsList(array(20));
            $table->setDefaultAlignmentOfCells('center', 1, 1, 1, 1);
            $table->setVerticalAlignmentOfCells('center', 1, 1, 1, 1);
            $table->setBordersOfCells(new BorderFormat(1, "#000000"), 1, 1, 1, 1, true, true, true, true);
            $table->writeToCell(1, 1,"<b> $value[0] </b>", new Font(12, Arial), new ParFormat('left'));

            $table = & $sect->addTable('left');
            $table->addRows(count($value[1]), 1);
            $table->addColumnsList(array(1, 3, 4, 6, 3, 3));
            $table->setBordersOfCells(new BorderFormat(1, "#000000"), 1, 1, count($value[1]), 6,true,true,true,true);
            foreach ($value[1] as $p => $val) {
                $table->writeToCell($p + 1, 1, $p + 1, new Font(12, Arial), new ParFormat('center'));
                $table->writeToCell($p + 1, 2, $val['numid'], new Font(12, Arial), new ParFormat());
                $table->writeToCell($p + 1, 3, $val['nombreyapellidos'], new Font(12, Arial), new ParFormat());
                $table->writeToCell($p + 1, 4, $val['cargo'], new Font(12, Arial), new ParFormat());
                $table->writeToCell($p + 1, 5, $val['estadovivienda'], new Font(12, Arial), new ParFormat());
                $table->writeToCell($p + 1, 6, $val['convivencia'], new Font(12, Arial), new ParFormat());
            }
        }
        $this->rtf->save("Reporte.rtf");
    }
}