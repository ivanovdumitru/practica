<?php

namespace B2B\BlogBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class CompanyprodController extends Controller{
    public function indexAction($id){
        $connect = $this->get('database_connection');
        /*$qb = $connect->CreateQueryBuilder();
        $qb->select(array('p'))
           ->from('products','p')
           ->where('p.id_company',$id);
                $qb->getQueryParts();    
                $list_company = $qb->getResult();*/
        $list_company['list_company'] = $connect->fetchAll("SELECT * FROM items where C=".$id);
        return $this->render('B2BBlogBundle:Company:list.html.twig',$list_company);
    }
}
