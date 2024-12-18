import csv
from fastapi import APIRouter, HTTPException
from decimal import Decimal
import time

import boto3
from boto3.dynamodb.conditions import Key
from boto3.dynamodb.conditions import Attr
from datetime import datetime, timezone, timedelta
from typing import Optional
import logging


router = APIRouter()
resource = boto3.resource('dynamodb', region_name='ap-northeast-2')

@router.get("/table_response")
async def get_table_response():
    table = resource.Table("resource_1")
    
    # 현재 시간 가져오기
    current_time = time.time()  # 현재 Unix Timestamp

    # 타임스탬프 범위 설정 (예: 최근 1시간 데이터)
    start_time = Decimal(str(int(current_time - (60 * 60 * 300))))  # 300시간 전
    end_time = Decimal(str(int(current_time)))               # 현재 시간

    response = table.scan(
        FilterExpression=Attr('sort_key').between(start_time, end_time)
    )
    sorted_items = sorted(response['Items'], key=lambda x: x['sort_key'])

    print(sorted_items)

    return sorted_items
