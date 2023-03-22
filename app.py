from core.app import *

class LandingView(MethodView):

    def get(self):
        return render_template('index.html')

class AppView(BaseView):

    @login_required
    def get(self, _id=None, account_id=None):
        if request.endpoint in ('app', 'app-dashboard'):
            # Cashburn
            cashburn = self.api(path=f'cashburn/{self.context["user_id"]}')
            temp = {}
            for k, v in cashburn.items():
                if k == 'cashburn':
                    temp[f'cashburn_{k}'] = round(cashburn['cashburn'] * 100, 1)
                else:
                    temp[f'cashburn_{k}'] = currency(cashburn[k])
            self.context.update(temp)

            # Stats
            stats = self.api(path=f'stats/{self.context["user_id"]}')
            for k, v in stats.items():
                if k in ('spending_power', 'networth'):
                    stats[k] = currency(v)
                elif k == 'wealth':
                    stats[k] = round(v * 100, 5)
                elif k == 'score':
                    stats[k] = round(v, 2)
                else:
                    if isinstance(v, float):
                        stats[k] = round(v * 100, 1)
            self.context['_stats'] = stats

            # Budget
            budget = self.api(path=f'budget/{self.context["user_id"]}')
            for k, v in budget.items():
                if k == 'categories':
                    pass
                    #for section in v:
                    #    if section in ('current', 'historical'):
                    #        for i, category in enumerate(v[section]):
                    #            for key, val in category.items():
                    #                if key != 'category':
                    #                    budget[k][section][i][key] = f'{round(val * 100, 1)}%' \
                    #                        if key.endswith('_percentage') else currency(val)
                    #    else:
                    #        budget[k][section] = currency(budget[k][section])
                    #budget_graph.Categories(v, f'budget_categories', self.context['user_id'])
                try: budget[k] = currency(v)
                except: pass
            self.context['_budget'] = budget

        elif request.endpoint.startswith('app-accounting'):
            # Accounting
            accounts = utils.convert_data(self, self.api(path=f'accounts/{self.context["user_id"]}'))
            try: accounts = sorted(accounts, key=operator.itemgetter('balance', 'name'), reverse=True)
            except: pass
            for account in accounts:
                try: account['balance'] = currency(account['balance'])
                except: pass
            transactions = []
            if _id:
                transactions = sorted(utils.convert_data(self, self.api(path=f'transactions/{_id}')),
                                      key=operator.itemgetter('date'), reverse=True)
            self.logger.info(transactions)

            self.context.update({'_accounts': accounts, 'selected_account': _id,
                                 '_transactions': transactions})

        elif request.endpoint.startswith('app-cashflow'):
            # Cashflow
            accounts = utils.convert_data(self, self.api(path=f'accounts/{self.context["user_id"]}'))
            accounts = sorted([{k: v for k, v in a.items() if k in ('_id', 'name')} for a in accounts],
                              key=operator.itemgetter('name'))
            incomes = sorted(utils.convert_data(self, self.api(path=f'incomes/{self.context["user_id"]}')),
                             key=operator.itemgetter('name'))
            expenses = sorted(utils.convert_data(self, self.api(path=f'expenses/{self.context["user_id"]}')),
                              key=operator.itemgetter('name'))
            targets = sorted(utils.convert_data(self, self.api(path=f'targets/{self.context["user_id"]}')),
                             key=operator.itemgetter('amount'))
            self.context.update({'_incomes': incomes, '_expenses': expenses,
                                 '_targets': targets, '_accounts': accounts})

        return render_template('app.html', **self.context)

    def post(self, _id=None, account_id=None):
        method_map = {'add': 'post',
                      'update': 'put',
                      'delete': 'delete',
                      'receive': 'post',
                      'pay': 'post',
                      'roll': 'put'}
        data = utils.convert_data(self, dict(request.form), 'to_dict')
        path = f'{request.endpoint.split("-")[-1]}/{account_id or self.context.get("user_id")}'
        if data['operation'] in ('update', 'delete', 'roll'):
            path += f'/{data.pop("_id")}'
        message = self.api(method=method_map[data['operation']], path=path, data=data)
        self.logger.debug(message)
        return self.get(account_id)

app.add_url_rule('/landing', view_func=LandingView.as_view('landing'))
app.add_url_rule('/app', view_func=AppView.as_view('app'))
app.add_url_rule('/app/dashboard', view_func=AppView.as_view('app-dashboard'))
app.add_url_rule('/app/accounting', view_func=AppView.as_view('app-accounting'))
app.add_url_rule('/app/accounting/accounts', view_func=AppView.as_view('app-accounting-accounts'))
app.add_url_rule('/app/accounting/accounts/<string:_id>',
                 view_func=AppView.as_view('app-accounting-accounts-detail'))
app.add_url_rule('/app/accounting/transactions/<string:account_id>',
                 view_func=AppView.as_view('app-accounting-transactions'))
app.add_url_rule('/app/accounting/transactions/<string:account_id>/<string:_id>',
                 view_func=AppView.as_view('app-accounting-transactions-detail'))
app.add_url_rule('/app/cashflow', view_func=AppView.as_view('app-cashflow'))
app.add_url_rule('/app/cashflow/incomes', view_func=AppView.as_view('app-cashflow-incomes'))
app.add_url_rule('/app/cashflow/expenses', view_func=AppView.as_view('app-cashflow-expenses'))
app.add_url_rule('/app/cashflow/targets', view_func=AppView.as_view('app-cashflow-targets'))
app.add_url_rule('/app/glossary', view_func=AppView.as_view('app-glossary'))
